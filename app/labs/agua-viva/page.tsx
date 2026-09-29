import styles from "./agua-viva.module.css";

export default function AguaVivaPage() {
  return (
    <main className={styles.page}>
      <div className={styles.embedWrapper}>
        <iframe
          className={styles.iframe}
          title="Jellyfish Chrysaora Blue 9 clips"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking; execution-while-out-of-viewport; execution-while-not-rendered; web-share"
          src="https://sketchfab.com/models/3d755f3c2479440a98b75450b820e551/embed"
        />
        <p className={styles.attribution}>
          <a href="https://sketchfab.com/3d-models/jellyfish-chrysaora-blue-9-clips-3d755f3c2479440a98b75450b820e551" target="_blank" rel="nofollow noreferrer">
            Jellyfish Chrysaora Blue 9 clips
          </a>{" "}
          by{" "}
          <a href="https://sketchfab.com/cgsoul" target="_blank" rel="nofollow noreferrer">
            Mikhail Nesterov
          </a>{" "}
          on{" "}
          <a href="https://sketchfab.com" target="_blank" rel="nofollow noreferrer">
            Sketchfab
          </a>
        </p>
      </div>
    </main>
  );
}
