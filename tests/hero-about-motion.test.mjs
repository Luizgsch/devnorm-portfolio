import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../lib/hero-about-motion.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const exports = {};
runInNewContext(outputText, { exports });
const { heroAboutMotion } = exports;

test("the circle covers every corner before content enters", () => {
  for (const [width, height] of [[1920, 1080], [1366, 768], [390, 1200]]) {
    const motion = heroAboutMotion(.42, width, height);
    assert.ok(motion.radius > Math.hypot(width / 2, height));
    assert.equal(motion.covered, true);
    assert.equal(motion.title, 0);
    assert.equal(motion.portrait, 0);
    assert.equal(motion.body, 0);
  }
});

test("title, portrait and body enter in the requested order", () => {
  for (const [progress, finished, waiting] of [[.65, "title", "portrait"], [.82, "portrait", "body"]]) {
    const motion = heroAboutMotion(progress, 1920, 1080);
    assert.equal(motion[finished], 1);
    assert.equal(motion[waiting], 0);
  }
  const complete = heroAboutMotion(.96, 1920, 1080);
  assert.equal(complete.body, 1);
});

test("scroll reversal retraces the same bounded states", () => {
  let previous = heroAboutMotion(0, 1920, 1080);
  for (let step = 1; step <= 100; step++) {
    const progress = step / 100;
    const motion = heroAboutMotion(progress, 1920, 1080);
    for (const key of ["radius", "title", "portrait", "body"]) {
      assert.ok(motion[key] >= previous[key]);
    }
    for (const key of ["title", "portrait", "body"]) assert.ok(motion[key] >= 0 && motion[key] <= 1);
    previous = motion;
  }
  assert.equal(heroAboutMotion(-1, 1920, 1080).radius, 0);
  assert.equal(heroAboutMotion(2, 1920, 1080).body, 1);
});
