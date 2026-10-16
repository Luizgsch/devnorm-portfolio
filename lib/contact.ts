export const demandOptions = [
  { value: "site", label: "Site ou landing page" },
  { value: "sistema", label: "Sistema sob medida" },
  { value: "automacao", label: "Automação ou integração" },
  { value: "whatsapp", label: "Atendimento por WhatsApp" },
  { value: "manutencao", label: "Manutenção ou melhoria" },
  { value: "outro", label: "Quero entender as possibilidades" },
] as const;

export type ContactData = { name: string; method: string; contact: string; demand: string; description: string; website: string };
export type ContactErrors = Partial<Record<keyof ContactData, string>>;
export const emptyContact: ContactData = { name: "", method: "email", contact: "", demand: "", description: "", website: "" };

export function validateContact(input: unknown): { data: ContactData; errors: ContactErrors; valid: boolean } {
  const source = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const data = Object.fromEntries(Object.keys(emptyContact).map((key) => [key, typeof source[key] === "string" ? source[key].trim() : ""])) as ContactData;
  const errors: ContactErrors = {};
  if (data.name.length < 2 || data.name.length > 100 || /[\r\n]/.test(data.name)) errors.name = "Informe seu nome, com 2 a 100 caracteres.";
  if (!["email", "whatsapp"].includes(data.method)) errors.method = "Escolha e-mail ou WhatsApp.";
  if (data.method === "email" && (data.contact.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact))) errors.contact = "Informe um e-mail válido, como nome@empresa.com.";
  if (data.method === "whatsapp" && (!/^[+\d\s().-]+$/.test(data.contact) || !/^\d{10,15}$/.test(data.contact.replace(/\D/g, "")) || data.contact.length > 30)) errors.contact = "Informe o número com DDD e, se necessário, código do país.";
  if (!demandOptions.some((option) => option.value === data.demand)) errors.demand = "Selecione o tipo de demanda.";
  if (data.description.length < 1 || data.description.length > 5000) errors.description = "Descreva sua necessidade em 1 a 5.000 caracteres.";
  if (data.website) errors.website = "Não foi possível validar a solicitação.";
  return { data, errors, valid: Object.keys(errors).length === 0 };
}

export function contactMessage(data: ContactData) {
  const demand = demandOptions.find((option) => option.value === data.demand)?.label ?? data.demand;
  return `Nome: ${data.name}\nContato (${data.method === "email" ? "e-mail" : "WhatsApp"}): ${data.contact}\nDemanda: ${demand}\n\n${data.description}`;
}
