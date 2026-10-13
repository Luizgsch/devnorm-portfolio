"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScrolling() {
  const pathname = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    const sync = () => {
      lenis?.destroy();
      lenis = undefined;
      if (reduced.matches || ["loading", "exiting"].includes(document.documentElement.dataset.preload ?? "")) return;
      lenis = new Lenis({ autoRaf: true, smoothWheel: true, syncTouch: false, lerp: .1, anchors: true,
        virtualScroll: ({ event, deltaY }) => {
          const target = event.target;
          if (!(target instanceof HTMLElement)) return true;
          const textarea = target.closest("textarea");
          const nativeRegion = target.closest("[data-lenis-prevent]");
          const canScrollTextarea = textarea && (
            deltaY < 0 ? textarea.scrollTop > 0 :
              deltaY > 0 && textarea.scrollTop + textarea.clientHeight < textarea.scrollHeight - 1
          );
          if (!nativeRegion && !canScrollTextarea) return true;

          // Finish page inertia before handing the gesture to a nested native scroller.
          lenis?.scrollTo(lenis.actualScroll, { immediate: true });
          return false;
        },
      });
    };
    sync();
    reduced.addEventListener("change", sync);
    window.addEventListener("devnorm:ready", sync);
    return () => { reduced.removeEventListener("change", sync); window.removeEventListener("devnorm:ready", sync); lenis?.destroy(); };
  }, [pathname]);
  return null;
}
