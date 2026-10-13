import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

function setup(preload = "done") {
  let options;
  let cleanup;
  let destroyed = 0;
  const events = {};
  const document = { documentElement: { dataset: { preload } } };
  const handoffs = [];
  class Element {
    constructor(textarea = null) { this.textarea = textarea; }
    closest(selector) { return selector === "textarea" ? this.textarea : null; }
  }
  class Lenis {
    actualScroll = 480;
    constructor(value) { options = value; }
    scrollTo(...args) { handoffs.push(args); }
    destroy() { destroyed++; }
  }
  const source = readFileSync(new URL("../app/components/SmoothScrolling.tsx", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  const exports = {};
  runInNewContext(outputText, {
    exports,
    HTMLElement: Element,
    document,
    window: { matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }), addEventListener: (name, callback) => { events[name] = callback; }, removeEventListener() {} },
    require: (name) => {
      if (name === "react") return { useEffect: (effect) => { cleanup = effect(); } };
      if (name === "next/navigation") return { usePathname: () => "/" };
      if (name === "lenis") return { default: Lenis };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  exports.default();
  return { get options() { return options; }, handoffs, Element, document, events, cleanup: () => cleanup(), get destroyed() { return destroyed; } };
}

test("page scrolling remains smooth over an empty textarea and at either boundary", () => {
  for (const [scrollTop, scrollHeight, deltaY] of [[0, 150, 100], [0, 500, -100], [350, 500, 100]]) {
    const { options, handoffs, Element } = setup();
    const target = new Element({ scrollTop, scrollHeight, clientHeight: 150 });
    assert.equal(options.virtualScroll({ event: { target }, deltaY }), true);
    assert.equal(handoffs.length, 0);
  }
});

test("nested textarea scrolling ends page inertia before native scrolling", () => {
  for (const deltaY of [-100, 100]) {
    const { options, handoffs, Element } = setup();
    const target = new Element({ scrollTop: 100, scrollHeight: 500, clientHeight: 150 });
    assert.equal(options.virtualScroll({ event: { target }, deltaY }), false);
    assert.equal(handoffs.length, 1);
    assert.equal(handoffs[0][0], 480);
    assert.equal(handoffs[0][1].immediate, true);
  }
});

test("regular controls keep page smoothing and anchors use the same scroll controller", () => {
  const { options, handoffs, Element } = setup();
  assert.equal(options.virtualScroll({ event: { target: new Element() }, deltaY: 100 }), true);
  assert.equal(handoffs.length, 0);
  assert.equal(options.anchors, true);
});

test("page inertia starts only after the preloader releases scrolling", () => {
  const context = setup("loading");
  assert.equal(context.options, undefined);
  context.document.documentElement.dataset.preload = "done";
  context.events["devnorm:ready"]();
  assert.equal(context.options.smoothWheel, true);
});


test("Lenis manages its clock and destroys the previous controller on restart and unmount", () => {
  const context = setup();
  assert.equal(context.options.autoRaf, true);
  context.events["devnorm:ready"]();
  assert.equal(context.destroyed, 1);
  context.cleanup();
  assert.equal(context.destroyed, 2);
});
