import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, proposals } from "../content";
import Video from "../Video";

export function generateStaticParams() { return proposals.map((item) => ({ direcao: item.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ direcao: string }> }) {
  const { direcao } = await params;
  return { title: proposals.find((item) => item.slug === direcao)?.name ?? "Proposta" };
}

function Arrow({ down = false }: { down?: boolean }) {
  return <svg className={down ? "arrow arrow-down" : "arrow"} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.4" /></svg>;
}

export default async function Proposal({ params }: { params: Promise<{ direcao: string }> }) {
  const { direcao } = await params;
  const proposal = proposals.find((item) => item.slug === direcao);
  if (!proposal) notFound();
  return <main className={`proposal ${proposal.slug}`}>
    <a className="skip-link" href="#projetos">Pular para projetos</a>
    <nav className="proposal-switch" aria-label="Comparar direções visuais"><Link href="/propostas" className="switch-label">Propostas</Link>{proposals.map((item) => <Link key={item.slug} href={`/propostas/${item.slug}`} aria-current={item.slug === proposal.slug ? "page" : undefined} aria-label={`${item.number}: ${item.name}`}>{item.number}</Link>)}</nav>
    <section className="hero" aria-label="Apresentação de Luiz Schreiner">
      <Video />
      <div className="hero-shade" />
      <header className="site-header">
        <Link className="wordmark" href="/propostas" aria-label="dev_norm — comparar propostas">dev<span>_</span>norm</Link>
        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#projetos">Projetos</a>
          <Link href="/propostas/escopo#sobre">Sobre mim</Link>
          <Link href="/propostas/escopo#servicos">Serviços</Link>
          <Link href="/propostas/escopo#tecnologias">Tecnologias</Link>
          <Link href="/propostas/escopo#contato">Contato <Arrow /></Link>
        </nav>
      </header>
      <div className="hero-copy">
        <h1>{proposal.slug === "cartaz" ? <>Luiz <span>Schreiner</span><span className="signature-dot">.</span></> : <>Sites<span className="punctuation">,</span><br className="diptico-break" /> sistemas<br className="cinema-break" /><span className="connector"> e </span>automações<span className="final-stop">.</span></>}</h1>
        {proposal.slug === "diptico" && <p className="hero-intro">Desenvolvimento de software <br />por Luiz Schreiner.</p>}
      </div>
      <div className="hero-bottom">
        <div className="author">{proposal.slug === "cartaz" ? <><h2>Sites, sistemas e automações.</h2><p>Desenvolvimento de software.</p></> : <><h2>Luiz Schreiner</h2><p>Desenvolvedor de software</p></>}</div>
        <div className="hero-actions"><a className="primary-action" href="#projetos">Conheça meus trabalhos <Arrow down /></a><Link className="secondary-action" href="/propostas/escopo#contato">Entre em contato <Arrow /></Link></div>
      </div>
      <div className="hero-caption" aria-hidden="true">dev_norm / desenvolvimento de software</div>
    </section>

    <div className="work-intro" id="projetos"><h2>Projetos</h2><p>Três espaços para trabalhos selecionados.<br />Imagens e informações aguardam seu conteúdo.</p><span>01 — 03</span></div>
    {projects.map((project) => <section className="project" key={project.slug} aria-labelledby={`title-${project.slug}`}>
      <div className="project-backdrop" style={{ backgroundImage: `url(${project.image})` }} aria-hidden="true" />
      <div className="project-wash" />
      <div className="project-number"><span>Projeto</span><strong>{project.number}</strong><span className="project-total">/ 03</span></div>
      <Link className="project-image" href={`/propostas/projeto/${project.slug}`} aria-label={`Abrir ficha de ${project.name}; conteúdo pendente`}>
        {/* SVG placeholders are intentionally not presented as project screenshots. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.image} alt={`Espaço reservado para a imagem de ${project.name}. Imagem real ainda não fornecida.`} width="1000" height="800" loading="lazy" />
        <span className="image-action"><Arrow /><span>Abrir ficha</span></span>
      </Link>
      <div className="project-info"><h2 id={`title-${project.slug}`}>{project.name}</h2><p>Natureza do trabalho a confirmar</p><Link href={`/propostas/projeto/${project.slug}`}>Ver projeto <Arrow /></Link></div>
      <p className="project-note">Prévia de composição · imagem pendente</p>
    </section>)}
    <footer className="proposal-footer"><div><Link className="wordmark" href="/propostas">dev<span>_</span>norm</Link><p>Proposta {proposal.number} — {proposal.name}</p></div><Link href="/propostas">Comparar as três propostas <Arrow /></Link></footer>
  </main>;
}
