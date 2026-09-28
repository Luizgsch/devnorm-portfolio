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
          stroke: "#ffffff",
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
          className="fita-svg fita-svg-desktop"
          viewBox="0 0 1440 3000"
          preserveAspectRatio="none"
          role="presentation"
        >
          <defs>
            <mask id="fita-reveal-desktop" maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="3000">
              <rect width="1440" height="3000" fill="black" />
              <path
                ref={desktopPath}
                className="fita-reveal-path"
                d="M -180 420 C 180 110 490 850 820 610 C 1110 400 1120 1090 1570 860 C 1870 710 1580 1520 1160 1760 C 760 1985 540 1530 160 2000 C -100 2350 300 2750 860 2530 C 1170 2405 1260 2820 1630 2940"
                fill="none"
                stroke="white"
                strokeWidth="360"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1"
                strokeDashoffset="1"
              />
            </mask>
          </defs>
          <path
            className="fita-ribbon"
            d="M -180 330 C 40 170 260 150 430 300 C 610 455 700 680 830 665 C 980 650 1040 450 1190 510 C 1330 565 1360 790 1540 850 C 1640 885 1700 930 1625 1020 C 1450 1220 1260 965 1090 930 C 930 895 870 1120 735 1320 C 610 1505 425 1660 200 1780 C 50 1860 -30 2010 95 2160 C 230 2325 455 2295 680 2240 C 920 2185 1100 2385 1290 2580 C 1425 2720 1535 2850 1660 2860 L 1610 3025 C 1460 3005 1300 2890 1160 2760 C 1000 2610 870 2420 660 2410 C 430 2400 190 2490 45 2320 C -115 2130 -45 1900 130 1790 C 330 1665 495 1515 610 1340 C 760 1110 850 810 1000 790 C 1125 770 1220 1000 1380 905 C 1490 840 1450 690 1290 670 C 1160 650 1070 815 880 815 C 680 815 565 575 370 425 C 210 300 40 350 -130 500 Z"
            fill={crimson}
            mask="url(#fita-reveal-desktop)"
          />
        </svg>

        <svg
          className="fita-svg fita-svg-mobile"
          viewBox="0 0 900 3000"
          preserveAspectRatio="none"
          role="presentation"
        >
          <defs>
            <mask id="fita-reveal-mobile" maskUnits="userSpaceOnUse" x="0" y="0" width="900" height="3000">
              <rect width="900" height="3000" fill="black" />
              <path
                ref={mobilePath}
                className="fita-reveal-path"
                d="M -110 340 C 250 120 420 650 270 920 C 100 1220 610 1300 470 1600 C 330 1900 690 1980 560 2260 C 455 2490 820 2700 520 3100"
                fill="none"
                stroke="white"
                strokeWidth="230"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1"
                strokeDashoffset="1"
              />
            </mask>
          </defs>
          <path
            className="fita-ribbon"
            d="M -110 250 C 80 160 260 200 350 380 C 430 540 390 700 280 920 C 160 1160 520 1280 520 1480 C 520 1660 350 1790 470 1930 C 600 2080 680 2130 600 2300 C 520 2470 650 2600 820 2730 L 720 3090 C 580 2930 390 2780 420 2610 C 450 2450 350 2350 280 2220 C 190 2050 350 1900 360 1760 C 370 1600 80 1510 180 1300 C 270 1110 200 1050 120 920 C 20 750 120 560 -110 430 Z"
            fill={crimson}
            mask="url(#fita-reveal-mobile)"
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
