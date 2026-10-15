"use client";

import { useState } from "react";
import styles from "./project-gallery.module.css";

export default function ProjectGallery({ name, images }: { name: string; images: string[] }) {
  const [active, setActive] = useState(0);
  if (!images.length) return null;
  const move = (direction: number) => setActive((current) => (current + direction + images.length) % images.length);
  return <section className={styles.gallery} aria-label={`Imagens do projeto ${name}`} onKeyDown={(event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  }}>
    <figure className={styles.frame}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[active]} alt={`${name} - captura ${active + 1} de ${images.length}`} width={1920} height={1080} />
    </figure>
    <div className={styles.controls}>
      <div className={styles.navigation}>
        <button type="button" onClick={() => move(-1)} aria-label="Imagem anterior"><Chevron back /></button>
        <p aria-live="polite" aria-atomic="true">Imagem {active + 1} de {images.length}</p>
        <button type="button" onClick={() => move(1)} aria-label="Próxima imagem"><Chevron /></button>
      </div>
      <div className={styles.thumbnails} aria-label="Escolher imagem">
        {images.map((src, index) => <button key={src} type="button" aria-label={`Ver imagem ${index + 1} de ${name}`} aria-current={active === index ? "true" : undefined} onClick={() => setActive(index)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" width={192} height={108} loading="lazy" />
        </button>)}
      </div>
    </div>
  </section>;
}

function Chevron({ back = false }: { back?: boolean }) {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path d={back ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} stroke="currentColor" strokeWidth="1.5" /></svg>;
}
