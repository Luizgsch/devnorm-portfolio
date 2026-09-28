"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const crimson = "#9d1239";

export default function FitaScroll() {
  const stage = useRef<HTMLDivElement>(null);
  const desktopPath = useRef<SVGPathElement>(null);
  const mobilePath = useRef<SVGPathElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useGSAP(
    () => {
      const paths = [desktopPath.current, mobilePath.current].filter(
        (path): path is SVGPathElement => path !== null,
      );
      const lengths = paths.map((path) => path.getTotalLength());

      paths.forEach((path, index) => {
        gsap.set(path, {
          stroke: crimson,
          strokeDasharray: lengths[index],
          strokeDashoffset: lengths[index],
        });
      });

      if (!stage.current) return;

      const endDistance = () =>
        `+=${Math.max(stage.current!.offsetHeight - window.innerHeight, 1)}`;

      if (reducedMotion) {
        ScrollTrigger.create({
          trigger: stage.current,
          start: "top top",
          end: endDistance,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            paths.forEach((path, index) => {
              gsap.set(path, {
                strokeDashoffset: lengths[index] * (1 - self.progress),
              });
            });
          },
        });
        requestAnimationFrame(() => ScrollTrigger.refresh());
        return;
      }

      const reveal = gsap.timeline({ paused: true });

      paths.forEach((path) => {
        reveal.to(path, { strokeDashoffset: 0, duration: 1, ease: "none" }, 0);
      });

      ScrollTrigger.create({
        trigger: stage.current,
        animation: reveal,
        start: "top top",
        end: endDistance,
        scrub: 0.8,
        invalidateOnRefresh: true,
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: stage, dependencies: [reducedMotion] },
  );

  return (
    <div
      ref={stage}
      className="fita-stage"
      data-reduced-motion={reducedMotion}
    >
      <div className="fita-art" aria-hidden="true">
        <svg
          className="fita-svg"
          viewBox="0 0 1440 3000"
          preserveAspectRatio="none"
          role="presentation"
        >
          <path
            ref={desktopPath}
            className="fita-path fita-path-desktop"
            d="M -180 420 C 180 110 490 850 820 610 C 1110 400 1120 1090 1570 860 C 1870 710 1580 1520 1160 1760 C 760 1985 540 1530 160 2000 C -100 2350 300 2750 860 2530 C 1170 2405 1260 2820 1630 2940"
            fill="none"
            stroke={crimson}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1"
            strokeDashoffset="1"
          />
          <path
            ref={mobilePath}
            className="fita-path fita-path-mobile"
            d="M -110 340 C 250 120 420 650 270 920 C 100 1220 610 1300 470 1600 C 330 1900 690 1980 560 2260 C 455 2490 820 2700 520 3100"
            fill="none"
            stroke={crimson}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1"
            strokeDashoffset="1"
          />
        </svg>
      </div>

      <section className="fita-section fita-section-first">
        <p className="fita-kicker">dev_norm / movimento 01</p>
        <h1>fita</h1>
        <p className="fita-copy">uma trajetória crimson, desenhada para revelar o gesto.</p>
      </section>
      <section className="fita-section fita-section-middle">
        <p className="fita-index">02 / meio do percurso</p>
        <h2>o caminho aparece aos poucos.</h2>
      </section>
      <section className="fita-section fita-section-last">
        <p className="fita-index">03 / fim do percurso</p>
        <h2>a faixa inteira, sem pressa.</h2>
      </section>
    </div>
  );
}
