export type ResourceState = "pending" | "ready" | "fallback";
export type PreloadResource = "fonts" | "poster" | "video";
export type PreloadSnapshot = Record<PreloadResource, ResourceState>;

export const PRELOAD_TIMEOUT = 8000;
export const PRELOAD_SESSION_KEY = "devnorm:first-screen-ready";

// Runs before the first paint; the independent deadline also covers failed hydration.
export const preloadBootstrap = `(() => {
  const root = document.documentElement;
  let seen = false;
  try { seen = sessionStorage.getItem('${PRELOAD_SESSION_KEY}') === '1'; } catch {}
  if (location.pathname !== '/' || seen) { root.dataset.preload = 'done'; return; }
  root.dataset.preload = 'loading';
  setTimeout(() => {
    if (root.dataset.preload !== 'loading') return;
    root.dataset.heroFallback = 'true';
    if (root.dataset.fontsReady !== 'true') root.dataset.fontFallback = 'true';
    root.dataset.preload = 'done';
    try { sessionStorage.setItem('${PRELOAD_SESSION_KEY}', '1'); } catch {}
    window.dispatchEvent(new Event('devnorm:preload-timeout'));
    window.dispatchEvent(new Event('devnorm:ready'));
  }, ${PRELOAD_TIMEOUT});
})();`;

export async function trackEssentialResources(
  tasks: Record<PreloadResource, (signal: AbortSignal) => Promise<void>>,
  signal: AbortSignal,
  report: (snapshot: PreloadSnapshot) => void,
) {
  const snapshot: PreloadSnapshot = { fonts: "pending", poster: "pending", video: "pending" };
  report({ ...snapshot });
  await Promise.all((Object.keys(tasks) as PreloadResource[]).map(async (key) => {
    try {
      await tasks[key](signal);
      snapshot[key] = "ready";
    } catch {
      snapshot[key] = "fallback";
    }
    if (!signal.aborted) report({ ...snapshot });
  }));
  return snapshot;
}

export function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const abort = () => reject(new DOMException("Aborted", "AbortError"));
    if (signal.aborted) { abort(); return; }
    signal.addEventListener("abort", abort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener("abort", abort));
  });
}
