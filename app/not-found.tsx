import Link from "next/link";
import { Footer, Header } from "./components/SiteChrome";
import styles from "./site.module.css";

export default function NotFound() {
  return <div className={styles.site} id="inicio"><Header /><main className={styles.reading}><h1>Esta página<br /><em>não está aqui.</em></h1><p>O endereço pode ter mudado. Você pode voltar ao início ou explorar os projetos.</p><Link className={styles.textAction} href="/">Voltar ao início</Link></main><Footer /></div>;
}
