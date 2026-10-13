"use client";

import { useEffect, useRef } from "react";
import styles from "../site.module.css";

export default function TechnologyRibbon() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const section = svg?.closest("section");
    if (!svg || !path || !section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    let displayed = 0;
    let lastTime = 0;
    const draw = (time: number) => {
      frame = 0;
      const bounds = section.getBoundingClientRect();
      const progress = reduced.matches ? 1 : Math.max(0, Math.min(1, (window.innerHeight * .75 - bounds.top) / bounds.height));
      const elapsed = lastTime ? Math.min(time - lastTime, 64) : 16.67;
      lastTime = time;
      displayed = reduced.matches ? progress : displayed + (progress - displayed) * (1 - Math.exp(-elapsed / 90));
      if (Math.abs(progress - displayed) < .00005) displayed = progress;
      path.style.strokeDashoffset = String(1 - displayed);
      svg.style.visibility = displayed > 0 ? "visible" : "hidden";
      if (visible && Math.abs(progress - displayed) >= .00005) frame = requestAnimationFrame(draw);
    };
    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(draw);
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    const resize = new ResizeObserver(schedule);
    intersection.observe(section);
    resize.observe(section);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    draw(performance.now());
    return () => {
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  return <svg ref={svgRef} className={styles.technologyRibbon} viewBox="0 0 1000 1600" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
    <path ref={pathRef} d="M240 -100 C300 50 800 150 790 440 C780 740 180 760 210 1080 C225 1300 730 1350 780 1710" pathLength="1" />
  </svg>;
}
