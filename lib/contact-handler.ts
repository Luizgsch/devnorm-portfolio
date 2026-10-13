import { createHash } from "node:crypto";
import { contactMessage, demandOptions, validateContact } from "./contact";

export type ContactConfig = { apiKey?: string; from?: string; to?: string };
type Dependencies = { config: () => ContactConfig; fetcher?: typeof fetch; now?: () => number };

function reply(status: number, data: object, headers: Record<string, string> = {}) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

async function readBody(request: Request) {
  if (Number(request.headers.get("content-length")) > 24_000) throw new RangeError("body too large");
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 24_000) { await reader.cancel(); throw new RangeError("body too large"); }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally { reader.releaseLock(); }
}

export function createContactHandler({ config, fetcher = fetch, now = Date.now }: Dependencies) {
  // Bounded, per-process protection. Hosting must also enforce a shared rate limit.
  const attempts = new Map<string, { count: number; until: number }>();
  return async function POST(request: Request) {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return reply(403, { error: "Origem da solicitação não permitida." });
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return reply(415, { error: "Formato de mensagem inválido." });
    let input: unknown;
    try { input = JSON.parse(await readBody(request)); } catch (error) {
      return reply(error instanceof RangeError ? 413 : 400, { error: error instanceof RangeError ? "A mensagem excedeu o tamanho permitido." : "Não foi possível ler a mensagem." });
    }
    const { data, valid, errors } = validateContact(input);
    if (!valid) return reply(400, { error: "Revise os campos indicados.", fields: errors });
    const requestId = (input as Record<string, unknown>).requestId;
    if (typeof requestId !== "string" || !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(requestId)) return reply(400, { error: "Recarregue a página e tente novamente." });
    const credentials = config();
    if (!credentials.apiKey || !credentials.from || !credentials.to) return reply(503, { error: "O envio pelo formulário está indisponível. Nenhuma mensagem foi enviada." });
    const time = now();
    for (const [key, value] of attempts) if (value.until <= time) attempts.delete(key);
    // Trust this header only when the hosting proxy overwrites it; see README.
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
    const key = createHash("sha256").update(ip).digest("hex");
    const limit = attempts.get(key) ?? { count: 0, until: time + 15 * 60_000 };
    if (limit.count >= 5 || (!attempts.has(key) && attempts.size >= 5000)) return reply(429, { error: "Muitas tentativas em pouco tempo. Aguarde 15 minutos antes de tentar novamente." }, { "Retry-After": "900" });
    limit.count += 1;
    attempts.set(key, limit);
    const text = contactMessage(data);
    const demand = demandOptions.find((option) => option.value === data.demand)!.label;
    const payload = JSON.stringify({ from: credentials.from, to: [credentials.to], subject: `dev_norm — ${demand}`, text, ...(data.method === "email" ? { reply_to: data.contact } : {}) });
    const digest = createHash("sha256").update(payload).digest("hex");
    try {
      const result = await fetcher("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${credentials.apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `devnorm/${requestId}/${digest}` },
        body: payload,
        signal: AbortSignal.timeout(10_000),
      });
      const receipt = await result.json();
      if (!result.ok || typeof receipt?.id !== "string" || !receipt.id) return reply(502, { error: "O serviço de envio não confirmou a mensagem. Seu texto foi mantido; tente novamente mais tarde." });
      return reply(200, { ok: true });
    } catch {
      return reply(502, { error: "Não foi possível confirmar o envio. Seu texto foi mantido; tente novamente mais tarde." });
    }
  };
}
