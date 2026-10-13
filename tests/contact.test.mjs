import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

// Compile the actual handlers into an isolated directory, without Next.js or network.
const work = await mkdtemp(join(tmpdir(), 'devnorm-contact-test-'));
for (const name of ['contact', 'contact-handler']) {
  const source = await readFile(new URL(`../lib/${name}.ts`, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  await writeFile(join(work, `${name}.mjs`), outputText.replace('"./contact"', '"./contact.mjs"'));
}
const { createContactHandler } = await import(pathToFileURL(join(work, 'contact-handler.mjs')));
const { validateContact } = await import(pathToFileURL(join(work, 'contact.mjs')));
test.after(async () => {
  assert.equal(dirname(resolve(work)), resolve(tmpdir()));
  assert.ok(basename(work).startsWith('devnorm-contact-test-'));
  await rm(work, { recursive: true, force: true });
});

const input = { name: 'Pessoa de teste', method: 'email', contact: 'test@example.invalid', demand: 'site', description: 'Preciso organizar as informações de um site institucional.', website: '', requestId: 'a829cf04-6399-4fe0-a5a2-4485c963c101' };
const config = () => ({ apiKey: 'fake-key-for-mocks', from: 'sender@example.invalid', to: 'recipient@example.invalid' });
const request = (body = input, headers = {}) => new Request('http://localhost:3000/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });

test('rejeita contato inválido, demanda desconhecida, mensagem curta e honeypot', () => {
  assert.equal(validateContact(input).valid, true);
  for (const invalid of [{ contact: 'not-an-email' }, { demand: 'inventado' }, { description: 'curta' }, { website: 'spam' }, { name: 'nome\ninjetado' }, { method: 'whatsapp', contact: 'abc123' }]) assert.equal(validateContact({ ...input, ...invalid }).valid, false);
  assert.equal(validateContact({ ...input, method: 'whatsapp', contact: '+55 (11) 99999-9999' }).valid, true);
});

test('sem credenciais não envia nem retorna sucesso', async () => {
  let calls = 0;
  const handler = createContactHandler({ config: () => ({}), fetcher: async () => { calls++; } });
  const response = await handler(request());
  assert.equal(response.status, 503);
  assert.notEqual((await response.json()).ok, true);
  assert.equal(calls, 0);
});

test('aceite exige resposta positiva e identificação do provedor', async () => {
  for (const [status, body] of [[500, { id: 'failure' }], [200, {}], [200, { id: '' }]]) {
    const handler = createContactHandler({ config, fetcher: async () => Response.json(body, { status }) });
    const response = await handler(request());
    assert.equal(response.status, 502);
    assert.notEqual((await response.json()).ok, true);
  }
});

test('timeout ou falha de rede não gera falso sucesso', async () => {
  const handler = createContactHandler({ config, fetcher: async () => { throw new Error('timeout'); } });
  assert.equal((await handler(request())).status, 502);
});

test('envia texto validado e mantém chave de idempotência em retry', async () => {
  const calls = [];
  const handler = createContactHandler({ config, fetcher: async (url, options) => { calls.push({ url, ...options }); return Response.json({ id: 'mock-receipt' }); } });
  const first = await handler(request());
  assert.deepEqual(await first.json(), { ok: true });
  await handler(request());
  assert.equal(calls[0].headers['Idempotency-Key'], calls[1].headers['Idempotency-Key']);
  const payload = JSON.parse(calls[0].body);
  assert.equal(payload.reply_to, input.contact);
  assert.ok(payload.text.includes(input.description));
  assert.equal(payload.html, undefined);
  await handler(request({ ...input, description: 'Uma demanda diferente para a mesma pessoa de teste.' }));
  assert.notEqual(calls[0].headers['Idempotency-Key'], calls[2].headers['Idempotency-Key']);
});

test('WhatsApp não entra como endereço reply_to', async () => {
  let payload;
  const handler = createContactHandler({ config, fetcher: async (_url, options) => { payload = JSON.parse(options.body); return Response.json({ id: 'mock' }); } });
  assert.equal((await handler(request({ ...input, method: 'whatsapp', contact: '+55 (11) 99999-9999' }))).status, 200);
  assert.equal(payload.reply_to, undefined);
  assert.ok(payload.text.includes('WhatsApp'));
});

test('origem externa, JSON inválido e corpo grande são recusados antes do provedor', async () => {
  const handler = createContactHandler({ config, fetcher: async () => { assert.fail('provider must not be called'); } });
  assert.equal((await handler(request(input, { Origin: 'https://other.example' }))).status, 403);
  assert.equal((await handler(request('{broken'))).status, 400);
  assert.equal((await handler(request('x'.repeat(25000)))).status, 413);
  assert.equal((await handler(request(input, { 'Content-Type': 'text/plain' }))).status, 415);
});

test('limite de tentativas expira e não aciona o provedor depois da quinta', async () => {
  let time = 1000, calls = 0;
  const handler = createContactHandler({ config, now: () => time, fetcher: async () => { calls++; return Response.json({ id: 'mock' }); } });
  for (let attempt = 0; attempt < 5; attempt++) assert.equal((await handler(request())).status, 200);
  assert.equal((await handler(request())).status, 429);
  assert.equal(calls, 5);
  time += 16 * 60_000;
  assert.equal((await handler(request())).status, 200);
});
