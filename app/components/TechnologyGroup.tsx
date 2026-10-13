"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import styles from "../site.module.css";

export default function TechnologyGroup({ name, tools, initiallyOpen = false }: {
  name: string;
  tools: readonly string[];
  initiallyOpen?: boolean;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const targetOpen = useRef(initiallyOpen);

  useEffect(() => () => animationRef.current?.cancel(), []);

  function toggle(event: MouseEvent<HTMLElement>) {
    event.preventDefault();
    const details = detailsRef.current;
    if (!details) return;

    const from = details.getBoundingClientRect().height;
    targetOpen.current = animationRef.current ? !targetOpen.current : !details.open;
    const opening = targetOpen.current;
    animationRef.current?.cancel();
    animationRef.current = null;
    details.style.height = "";
    details.style.overflow = "";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      details.open = opening;
      return;
    }

    // Measure the natural destination, keeping content rendered until closing finishes.
    details.open = opening;
    const to = details.getBoundingClientRect().height;
    details.open = true;
    details.style.height = `${from}px`;
    details.style.overflow = "hidden";
    const animation = details.animate(
      [{ height: `${from}px` }, { height: `${to}px` }],
      { duration: opening ? 420 : 340, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
    );
    animationRef.current = animation;
    animation.onfinish = () => {
      details.open = opening;
      details.style.height = "";
      details.style.overflow = "";
      animationRef.current = null;
      animation.cancel();
    };
  }

  return <details ref={detailsRef} className={styles.technologyGroup} open={initiallyOpen}>
    <summary onClick={toggle}><span>{name}</span><svg className={styles.technologyToggle} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h16" /><path className={styles.technologyPlus} d="M12 4v16" /></svg></summary>
    <ul>{tools.map((tool) => <li key={tool}><span>{tool}</span></li>)}</ul>
  </details>;
}
