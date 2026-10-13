"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_VIDEO_SRC as VIDEO_SRC, HERO_POSTER_SRC as POSTER_SRC } from "@/lib/hero-media";

export default function Video({ filmClassName = "film", controlClassName = "film-control", playOnMobile = false }: { filmClassName?: string; controlClassName?: string; playOnMobile?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  function announce(state: "ready" | "fallback") {
    if (!playOnMobile || !mediaRef.current) return;
    mediaRef.current.dataset.heroState = state;
    window.dispatchEvent(new Event("devnorm:hero-settled"));
  }

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 700px)");
    const fallback = () => {
      if (!playOnMobile) return;
      const video = ref.current;
      video?.pause();
      video?.removeAttribute("src");
      video?.load();
      if (mediaRef.current) mediaRef.current.dataset.heroState = "fallback";
      window.dispatchEvent(new Event("devnorm:hero-settled"));
      setFailed(true);
      setPlaying(false);
    };
    const sync = () => {
      const video = ref.current;
      if (!video) return;
      if (playOnMobile && document.documentElement.dataset.heroFallback === "true") { fallback(); return; }
      if (reduced.matches || (mobile.matches && !playOnMobile)) {
        video.pause(); setPlaying(false);
        if (mediaRef.current) mediaRef.current.dataset.heroState = "fallback";
        window.dispatchEvent(new Event("devnorm:hero-settled"));
        return;
      }
      if (video.getAttribute("src") !== VIDEO_SRC) { video.src = VIDEO_SRC; video.load(); }
      void video.play().catch(() => { setPlaying(false); fallback(); });
    };
    sync();
    reduced.addEventListener("change", sync);
    mobile.addEventListener("change", sync);
    window.addEventListener("devnorm:hero-fallback", fallback);
    window.addEventListener("devnorm:preload-timeout", fallback);
    return () => { reduced.removeEventListener("change", sync); mobile.removeEventListener("change", sync); window.removeEventListener("devnorm:hero-fallback", fallback); window.removeEventListener("devnorm:preload-timeout", fallback); };
  }, [playOnMobile]);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      if (video.getAttribute("src") !== VIDEO_SRC) { video.src = VIDEO_SRC; video.load(); }
      void video.play().catch(() => setFailed(true));
    }
    else video.pause();
  }

  return <>
    {/* The poster stays beneath the video if loading or autoplay fails. */}
    <div ref={mediaRef} className={filmClassName} data-hero-media={playOnMobile ? "essential" : undefined} role="img" aria-label="Luiz joga xadrez contra outra versão de si em um cenário vermelho.">
      {!failed && <video ref={ref} autoPlay muted playsInline loop preload="none" poster={POSTER_SRC} aria-hidden="true" onCanPlay={() => announce("ready")} onPlaying={() => announce("ready")} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { announce("fallback"); setFailed(true); setPlaying(false); }} />}
    </div>
    {!failed && <button className={controlClassName} onClick={toggle} aria-label={playing ? "Pausar vídeo de fundo" : "Reproduzir vídeo de fundo"}>
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">{playing ? <path d="M7 4v12M13 4v12" stroke="currentColor" strokeWidth="2" /> : <path d="m6 3 10 7-10 7V3Z" stroke="currentColor" />}</svg>
      <span>{playing ? "Pausar vídeo" : "Reproduzir vídeo"}</span>
    </button>}
  </>;
}
