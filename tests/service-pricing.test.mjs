import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../lib/service-pricing.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const exports = {};
runInNewContext(outputText, { exports });
const { servicePricing } = exports;

test("the supplied prices retain the distinction between references and starting prices", () => {
  assert.equal(servicePricing.length, 5);
  assert.deepEqual(Array.from(servicePricing, (service) => service.price), ["Referência: R$ 900", "Referência: R$ 2.000", "A partir de R$ 3.500", "A partir de R$ 3.000", "Referência: R$ 1.500"]);
  assert.ok(servicePricing.find((service) => service.name === "Sistema simples").description.includes("Requer avaliação do escopo."));
});
