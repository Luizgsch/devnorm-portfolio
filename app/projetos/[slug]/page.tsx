import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/portfolio";
import { Arrow, Footer, Header } from "../../components/SiteChrome";
import styles from "../../site.module.css";

export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return { title: project?.name ?? "Projeto não encontrado", description: project ? `Ficha de ${project.name}, projeto apresentado no portfólio de Luiz Schreiner.` : undefined, robots: project?.context ? undefined : { index: false, follow: true } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  return <div className={styles.site} id="inicio"><a className={styles.skipLink} href="#ficha">Pular para a ficha do projeto</a><Header /><main>
    <section className={styles.detailHero}><Link className={styles.breadcrumb} href="/#projetos"><Arrow />Todos os projetos</Link><div className={styles.detailTitle}><h1>{project.name}</h1><span>{project.number} / 03</span></div><p className={styles.detailLead}>{project.context ?? "Este espaço vai reunir o contexto, o desenvolvimento e as imagens do projeto. A ficha está em preparação; os campos abaixo indicam o conteúdo que falta completar."}</p></section>
    <figure className={styles.detailImage}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={project.image} alt={project.imagePending ? `Espaço reservado para a imagem de ${project.name}.` : project.name} width={1000} height={800} />
      {project.imagePending && <figcaption>Imagem do projeto a fornecer.</figcaption>}
    </figure>
    <section className={styles.detailBody} id="ficha"><div><h2>O projeto,<br /><em>em detalhe.</em></h2><p>Informações sobre o trabalho e o que foi desenvolvido.</p></div><dl className={styles.projectFacts}>
      <div><dt>Contexto</dt><dd>{project.context ?? "A completar: o problema que motivou o projeto e para quem ele foi desenvolvido."}</dd></div>
      <div><dt>Natureza do trabalho</dt><dd>{project.nature ?? "A confirmar: trabalho contratado, projeto pessoal ou estudo."}</dd></div>
      <div><dt>O que foi desenvolvido</dt><dd>{project.development ?? "A completar: participação de Luiz, funcionalidades e decisões de desenvolvimento."}</dd></div>
      <div><dt>Tecnologias</dt><dd>{project.technologies.length ? project.technologies.join(" / ") : "A confirmar com o código e a documentação do projeto."}</dd></div>
      <div><dt>Imagens e links</dt><dd>A fornecer: capturas reais e endereços públicos disponíveis.</dd></div>
    </dl></section>
    <nav className={styles.detailNext} aria-label="Próximo projeto"><span>Continue pelos projetos</span><Link href={`/projetos/${next.slug}`}>{next.name}<Arrow /></Link></nav>
  </main><Footer /></div>;
}
