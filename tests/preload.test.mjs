import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../lib/preload.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const exports = {};
runInNewContext(outputText, { exports, Promise, DOMException });
const { trackEssentialResources, abortable, preloadBootstrap, PRELOAD_TIMEOUT } = exports;
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};

function bootstrap({ seen = false, pathname = "/", storageError = false } = {}) {
  const root = { dataset: {} };
  const events = [];
  let deadline;
  const store = new Map(seen ? [["devnorm:first-screen-ready", "1"]] : []);
  const sessionStorage = {
    getItem: (key) => { if (storageError) throw new Error("denied"); return store.get(key); },
    setItem: (key, value) => { if (storageError) throw new Error("denied"); store.set(key, value); },
  };
  runInNewContext(preloadBootstrap, {
    document: { documentElement: root },
    location: { pathname },
    sessionStorage,
    window: { dispatchEvent: (event) => events.push(event.type) },
    Event,
    setTimeout: (callback, delay) => { deadline = { callback, delay }; },
  });
  return { root, events, store, deadline };
}

test("normal loading reports only actual completed essential stages", async () => {
  const fonts = deferred();
  const poster = deferred();
  const video = deferred();
  const snapshots = [];
  const done = trackEssentialResources({ fonts: () => fonts.promise, poster: () => poster.promise, video: () => video.promise }, new AbortController().signal, (snapshot) => snapshots.push(snapshot));
  assert.equal(snapshots.length, 1);
  fonts.resolve();
  await Promise.resolve();
  assert.equal(snapshots.at(-1).fonts, "ready");
  assert.equal(snapshots.at(-1).video, "pending");
  poster.resolve();
  video.resolve(); // Simulates canplay, not the completion of a full video download.
  const result = await done;
  assert.equal(Object.values(result).filter((state) => state === "ready").length, 3);
  assert.equal(snapshots.length, 4);
});

test("video failure is a settled fallback, not an indefinite wait", async () => {
  const result = await trackEssentialResources({
    fonts: async () => {}, poster: async () => {}, video: async () => { throw new Error("network"); },
  }, new AbortController().signal, () => {});
  assert.equal(result.video, "fallback");
  assert.equal(result.fonts, "ready");
});

test("slow loading never invents progress and can be cancelled at the deadline", async () => {
  const controller = new AbortController();
  const snapshots = [];
  const pending = () => abortable(new Promise(() => {}), controller.signal);
  const result = trackEssentialResources({ fonts: pending, poster: pending, video: pending }, controller.signal, (snapshot) => snapshots.push(snapshot));
  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.equal(snapshots.length, 1);
  assert.ok(Object.values(snapshots[0]).every((state) => state === "pending"));
  controller.abort();
  await result;
  assert.equal(snapshots.length, 1);
});

test("the independent eight-second limit reveals a fallback even without hydration", () => {
  const { root, deadline, events, store } = bootstrap();
  assert.equal(root.dataset.preload, "loading");
  assert.equal(deadline.delay, 8000);
  assert.equal(PRELOAD_TIMEOUT, 8000);
  deadline.callback();
  assert.equal(root.dataset.preload, "done");
  assert.equal(root.dataset.heroFallback, "true");
  assert.equal(root.dataset.fontFallback, "true");
  assert.ok(events.includes("devnorm:preload-timeout"));
  assert.ok(events.includes("devnorm:ready"));
  assert.equal(store.get("devnorm:first-screen-ready"), "1");
});

test("a slow video does not replace fonts that already loaded", () => {
  const { root, deadline } = bootstrap();
  root.dataset.fontsReady = "true";
  deadline.callback();
  assert.equal(root.dataset.fontFallback, undefined);
  assert.equal(root.dataset.heroFallback, "true");
});

test("the loader does not reappear in a viewed session or on non-hero pages", () => {
  for (const options of [{ seen: true }, { pathname: "/sobre" }]) {
    const { root, deadline } = bootstrap(options);
    assert.equal(root.dataset.preload, "done");
    assert.equal(deadline, undefined);
  }
});

test("blocked session storage still allows the timeout to release the page", () => {
  const { root, deadline } = bootstrap({ storageError: true });
  deadline.callback();
  assert.equal(root.dataset.preload, "done");
});

test("the deadline does not interrupt the normal exit transition", () => {
  const { root, deadline, events } = bootstrap();
  root.dataset.preload = "exiting";
  deadline.callback();
  assert.equal(root.dataset.preload, "exiting");
  assert.equal(events.length, 0);
});
