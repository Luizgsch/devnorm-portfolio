"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { HERO_POSTER_SRC } from "@/lib/hero-media";
import { abortable, PRELOAD_SESSION_KEY, trackEssentialResources, type PreloadSnapshot } from "@/lib/preload";

function waitForVideo(signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    let media: HTMLElement | null = null;
    let video: HTMLVideoElement | null = null;
    const cleanup = () => {
      observer.disconnect();
      window.removeEventListener("devnorm:hero-settled", check);
      signal.removeEventListener("abort", abort);
      video?.removeEventListener("canplay", check);
      video?.removeEventListener("error", check);
    };
    const finish = (failed: boolean) => {
      cleanup();
      if (failed) reject(new Error("Hero uses its poster"));
      else resolve();
    };
    const abort = () => finish(true);
    const check = () => {
      media = document.querySelector<HTMLElement>('[data-hero-media="essential"]');
      if (!media) return;
      if (media.dataset.heroState === "fallback") { finish(true); return; }
      if (media.dataset.heroState === "ready") { finish(false); return; }
      const candidate = media.querySelector("video");
      if (candidate !== video) {
        video?.removeEventListener("canplay", check);
        video?.removeEventListener("error", check);
        video = candidate;
        video?.addEventListener("canplay", check);
        video?.addEventListener("error", check);
      }
      if (video?.error) finish(true);
      else if (video && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) finish(false);
    };
    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("devnorm:hero-settled", check);
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
    else check();
  });
}

export default function Preloader({ children }: { children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null);
  const [resources, setResources] = useState<PreloadSnapshot>({ fonts: "pending", poster: "pending", video: "pending" });

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.preload !== "loading") return;
    const controller = new AbortController();
    const { signal } = controller;
    const startedAt = performance.now();
    let presentationTimer: ReturnType<typeof setTimeout> | undefined;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;
    if (content.current) content.current.inert = true;

    const release = () => {
      clearTimeout(presentationTimer);
      if (content.current) content.current.inert = false;
      controller.abort();
    };
    window.addEventListener("devnorm:preload-timeout", release);
    const tasks = {
      fonts: async () => {
        const style = getComputedStyle(document.body);
        const hero = style.getPropertyValue("--font-hero").trim();
        const sans = style.getPropertyValue("--font-sans").trim();
        const loaded = await abortable(Promise.all([
          document.fonts.load(`500 32px ${hero}`, "Luiz Schreiner"),
          document.fonts.load(`400 16px ${sans}`, "Projetos Sobre mim Serviços Tecnologias Contato"),
          document.fonts.load(`750 25px ${sans}`, "dev_norm"),
        ]), signal);
        if (loaded.some((faces) => faces.length === 0)) throw new Error("Essential font unavailable");
        root.dataset.fontsReady = "true";
      },
      poster: async () => {
        const poster = new Image();
        poster.src = HERO_POSTER_SRC;
        await abortable(poster.decode(), signal);
      },
      video: waitForVideo,
    };
    void trackEssentialResources(tasks, signal, setResources).then((snapshot) => {
      if (signal.aborted) return;
      if (snapshot.fonts === "fallback") root.dataset.fontFallback = "true";
      if (snapshot.video === "fallback") {
        root.dataset.heroFallback = "true";
        window.dispatchEvent(new Event("devnorm:hero-fallback"));
      }
      // Keep the presentation readable without changing measured resource progress.
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const presentationDelay = reduced ? 0 : Math.max(600, 1800 - (performance.now() - startedAt));
      presentationTimer = setTimeout(() => {
        if (signal.aborted) return;
        frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          if (signal.aborted) return;
          root.dataset.preload = "exiting";
          if (content.current) content.current.inert = false;
          exitTimer = setTimeout(() => {
            root.dataset.preload = "done";
            try { sessionStorage.setItem(PRELOAD_SESSION_KEY, "1"); } catch {}
            window.dispatchEvent(new Event("devnorm:ready"));
          }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220);
        });
        });
      }, presentationDelay);
    });
    return () => {
      window.removeEventListener("devnorm:preload-timeout", release);
      cancelAnimationFrame(frame);
      clearTimeout(exitTimer);
      release();
    };
  }, []);

  const completed = Object.values(resources).filter((state) => state !== "pending").length;
  return <>
    <div className="preloader" role="status" aria-live="polite" aria-label="Preparando a primeira tela">
      <div className="preloaderComposition">
        <div className="preloaderBrand" aria-hidden="true">dev<span>_</span>norm</div>
        <div className="preloaderTrack" role="progressbar" aria-label="Recursos essenciais verificados" aria-valuemin={0} aria-valuemax={3} aria-valuenow={completed} aria-valuetext={`${completed} de 3 etapas verificadas`}>
          <div className="preloaderFill" style={{ transform: `scaleX(${completed / 3})` }} />
        </div>
      </div>
    </div>
    <div ref={content} className="siteContent">{children}</div>
  </>;
}
