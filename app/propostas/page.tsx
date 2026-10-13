import Link from "next/link";
import { proposals } from "./content";

export default function Proposals() {
  return <main className="direction-index">
    <header className="index-header"><span className="wordmark">dev<span>_</span>norm</span><span>Luiz Schreiner · Estudo de direção visual</span></header>
    <h1>Uma marca.<br /><em>Três presenças.</em></h1>
    <p className="index-intro">O mesmo filme, o mesmo conteúdo. Três maneiras de apresentar seu trabalho. Explore o hero e os projetos antes de escolher uma direção.</p>
    <div className="direction-list">{proposals.map((item) => <article key={item.slug}>
      <Link href={`/propostas/${item.slug}`} className={`direction-preview preview-${item.slug}`} aria-label={`Explorar ${item.name}`}>
        <div className="preview-film" /><span className="preview-brand">dev_norm</span>
        <span className="preview-title">{item.slug === "cartaz" ? <>Luiz Schreiner.</> : <>Sites, sistemas<br />e automações.</>}</span>
        <span className="preview-author">Luiz Schreiner</span><span className="preview-open">Explorar proposta</span>
      </Link>
      <div className="direction-title"><span>{item.number}</span><h2><Link href={`/propostas/${item.slug}`}>{item.name}</Link></h2></div>
      <p>{item.description}</p><p className="direction-tradeoff">{item.tradeoff}</p>
    </article>)}</div>
    <aside className="index-note"><h2>Sobre esta prévia</h2><p>Os três projetos usam espaços identificados porque suas imagens e fichas não estão no repositório. O vídeo original mantém a marca d’água. No celular, um frame estático preserva o enquadramento completo.</p><p>Somente hero e projetos estão em avaliação. Os demais links levam ao escopo da próxima etapa.</p></aside>
    <footer className="index-footer">Escolha 01, 02 ou 03 na conversa. Também vale combinar elementos e pedir ajustes.</footer>
  </main>;
}
