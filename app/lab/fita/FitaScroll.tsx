"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const crimson = "#9d1239";
const foldShadow = "#560a24";
const foldLight = "#d12852";

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
        `+=${Math.max(window.innerHeight, 1)}`;

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
          viewBox="0 0 1440 1000"
          preserveAspectRatio="none"
          role="presentation"
        >
          <defs>
            <mask id="fita-reveal-desktop" maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="1000">
              <rect width="1440" height="1000" fill="black" />
              <path
                ref={desktopPath}
                className="fita-reveal-path"
                d="M 70 370 C 250 120 450 120 610 320 C 760 500 880 650 1030 560 C 1170 485 1290 520 1410 700"
                fill="none"
                stroke="white"
                strokeWidth="250"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1"
                strokeDashoffset="1"
              />
            </mask>
          </defs>
          <path
            className="fita-ribbon"
            d="M 70 295 C 230 80 430 80 590 265 C 755 455 875 585 1030 495 C 1185 405 1305 460 1410 660 C 1310 585 1200 555 1065 640 C 875 760 710 600 545 400 C 400 225 260 250 70 455 Z"
            fill={crimson}
            mask="url(#fita-reveal-desktop)"
          />
          <path
            className="fita-fold-shadow"
            d="M 575 300 C 730 480 865 615 1035 535 C 1145 485 1245 500 1340 580 C 1240 545 1150 565 1060 625 C 885 745 735 600 575 405 Z"
            fill={foldShadow}
            mask="url(#fita-reveal-desktop)"
          />
          <path
            className="fita-fold-light"
            d="M 180 210 C 315 100 430 125 535 250 C 570 292 598 325 630 355"
            fill="none"
            stroke={foldLight}
            strokeWidth="18"
            strokeLinecap="round"
            mask="url(#fita-reveal-desktop)"
          />
        </svg>

        <svg
          className="fita-svg fita-svg-mobile"
          viewBox="0 0 900 1000"
          preserveAspectRatio="none"
          role="presentation"
        >
          <defs>
            <mask id="fita-reveal-mobile" maskUnits="userSpaceOnUse" x="0" y="0" width="900" height="1000">
              <rect width="900" height="1000" fill="black" />
              <path
                ref={mobilePath}
                className="fita-reveal-path"
                d="M 55 350 C 240 120 420 160 475 345 C 530 535 330 590 420 735 C 495 850 630 780 840 900"
                fill="none"
                stroke="white"
                strokeWidth="180"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1"
                strokeDashoffset="1"
              />
            </mask>
          </defs>
          <path
            className="fita-ribbon"
            d="M 55 290 C 220 80 385 120 435 325 C 480 505 275 595 390 755 C 475 875 620 800 845 845 L 840 955 C 600 940 420 970 315 825 C 190 655 390 520 330 350 C 285 225 185 245 55 415 Z"
            fill={crimson}
            mask="url(#fita-reveal-mobile)"
          />
          <path
            className="fita-fold-shadow"
            d="M 355 300 C 440 485 320 590 415 735 C 475 825 590 805 700 850 C 575 820 480 875 400 790 C 300 680 430 545 370 400 Z"
            fill={foldShadow}
            mask="url(#fita-reveal-mobile)"
          />
          <path
            className="fita-fold-light"
            d="M 140 205 C 250 125 335 165 375 270"
            fill="none"
            stroke={foldLight}
            strokeWidth="14"
            strokeLinecap="round"
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
