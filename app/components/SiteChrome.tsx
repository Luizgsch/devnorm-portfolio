import Link from "next/link";
import type { ContactChannel } from "@/lib/site-config";
import styles from "../site.module.css";

export function Arrow({ down = false }: { down?: boolean }) {
  return <svg className={`${styles.arrow} ${down ? styles.arrowDown : ""}`} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.4" /></svg>;
}

export function Brand() {
  return <Link className={styles.brand} href="/" aria-label="dev_norm — início">dev<span>_</span>norm</Link>;
}

export function Header({ home = false }: { home?: boolean }) {
  return <header className={styles.header}><Brand /><nav className={styles.nav} aria-label="Navegação principal">
    {[["projetos", "Projetos"], ["sobre", "Sobre mim"], ["servicos", "Serviços"], ["tecnologias", "Tecnologias"], ["contato", "Contato"]].map(([id, label]) => <Link key={id} href={`${home ? "" : "/"}#${id}`}>{label}{id === "contato" && <Arrow />}</Link>)}
  </nav></header>;
}

export function Footer({ channels = [] }: { channels?: ContactChannel[] }) {
  return <footer className={styles.footer}><div className={styles.footerTop}><Brand /><p>Sites, sistemas e automações.<br />Por Luiz Schreiner.</p><a href="#inicio">Voltar ao início <Arrow /></a></div><div className={styles.footerBottom}><span>© {new Date().getFullYear()} dev_norm</span><nav aria-label="Links do rodapé">{channels.filter((channel) => channel.href).map((channel) => <a key={channel.label} href={channel.href!} rel={channel.href!.startsWith("https") ? "noopener noreferrer" : undefined}>{channel.label}</a>)}<Link href="/privacidade">Privacidade</Link></nav><span>Desenvolvimento de software</span></div></footer>;
}
