"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { heroAboutMotion } from "@/lib/hero-about-motion";
import styles from "../site.module.css";

export default function HeroAboutTransition({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = root?.firstElementChild as HTMLElement | null;
    const hero = stage?.querySelector<HTMLElement>(`.${styles.hero}`);
    const about = stage?.querySelector<HTMLElement>("#sobre");
    if (!root || !stage || !hero || !about) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let travel = 0;
    let height = 0;
    let width = 0;

    const draw = () => {
      frame = 0;
      if (reduced.matches || !travel) return;
      const top = root.getBoundingClientRect().top;
      const progress = -top / travel;
      const motion = heroAboutMotion(progress, width, height);
      root.style.setProperty("--about-radius", `${motion.radius}px`);
      root.style.setProperty("--about-title-progress", String(motion.title));
      root.style.setProperty("--about-portrait-progress", String(motion.portrait));
      root.style.setProperty("--about-body-progress", String(motion.body));
      root.dataset.titleVisible = String(motion.title > 0);
      root.dataset.portraitVisible = String(motion.portrait > 0);
      root.dataset.bodyVisible = String(motion.body > 0);
      // Account for the sticky stage's current position when navigating to #sobre.
      about.style.scrollMarginTop = `${Math.min(travel, Math.max(0, -top)) - travel}px`;
      hero.inert = motion.covered;
      about.inert = !motion.covered;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const measure = () => {
      if (reduced.matches) {
        delete root.dataset.motion;
        root.style.removeProperty("--about-stage-height");
        root.style.removeProperty("--about-travel");
        about.style.removeProperty("scroll-margin-top");
        hero.inert = about.inert = false;
        return;
      }
      root.dataset.motion = "scroll";
      width = root.clientWidth;
      height = Math.max(window.innerHeight, about.offsetHeight);
      travel = window.innerHeight * 2.6;
      root.style.setProperty("--about-stage-height", `${height}px`);
      root.style.setProperty("--about-travel", `${travel}px`);
      draw();
    };
    const revealOnFocus = (event: FocusEvent) => {
      // Touch focus must not move the link between pointer down and click.
      if (!reduced.matches && event.target instanceof HTMLElement && event.target.matches(":focus-visible") && about.contains(event.target)) {
        window.scrollTo({ top: window.scrollY + root.getBoundingClientRect().top + travel });
        draw();
      }
    };
    const resize = new ResizeObserver(measure);
    resize.observe(about);
    measure();
    if (window.location.hash === "#sobre" && !reduced.matches) {
      window.scrollTo({ top: window.scrollY + root.getBoundingClientRect().top + travel });
      draw();
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    reduced.addEventListener("change", measure);
    about.addEventListener("focusin", revealOnFocus);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      reduced.removeEventListener("change", measure);
      about.removeEventListener("focusin", revealOnFocus);
      delete root.dataset.motion;
      about.style.removeProperty("scroll-margin-top");
      hero.inert = about.inert = false;
    };
  }, []);

  return <div ref={rootRef} className={styles.heroAboutTransition}>
    <div className={styles.heroAboutStage}>{children}</div>
  </div>;
}
