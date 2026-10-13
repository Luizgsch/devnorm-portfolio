import Link from "next/link";
import type { Metadata } from "next";
import { Arrow, Footer, Header } from "../components/SiteChrome";
import styles from "../site.module.css";

export const metadata: Metadata = {
  title: "Projetos | dev_norm",
  description: "A página de todos os projetos da dev_norm está em desenvolvimento.",
  robots: { index: false, follow: true },
};

export default function ProjectsIndex() {
  return <div className={styles.site} id="inicio">
    <Header />
    <main className={styles.projectsIndex}>
      <h1>Projetos<span>.</span></h1>
      <p>Ainda em desenvolvimento.</p>
      <Link href="/#projetos">Voltar aos projetos em destaque <Arrow /></Link>
    </main>
    <Footer />
  </div>;
}
