import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectGallery from "../../components/ProjectGallery";
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
    <section className={styles.detailHero}><Link className={styles.breadcrumb} href="/#projetos"><Arrow />Todos os projetos</Link><div className={styles.detailTitle}><h1>{project.name}</h1><span>{project.number} / 03</span></div><p className={styles.detailLead}>{project.context ?? "Este espaço vai reunir o contexto, o desenvolvimento e as imagens do projeto. A ficha está em preparação; os campos abaixo indicam o conteúdo que falta completar."}</p>
      <nav className={styles.projectLinks} aria-label="Links do projeto">
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Ver projeto online <Arrow /></a>
        <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">Ver repositório <Arrow /></a>
      </nav>
    </section>
    <ProjectGallery name={project.name} images={project.images} />
    <section className={styles.detailBody} id="ficha" aria-labelledby="project-story-title">
      <header className={styles.detailStoryHeading}>
        <h2 id="project-story-title">O projeto,<br /><em>em detalhe.</em></h2>
        {project.nature && <p>{project.nature}</p>}
      </header>
      <div className={styles.projectStory}>
        {[
          { title: "Sobre o projeto", text: project.context },
          { title: "Por que fiz este projeto", text: project.motivation },
          { title: "O que foi desenvolvido", text: project.development, items: project.storyItems?.development },
          { title: "Tecnologias utilizadas", text: project.technologyDescription ?? (project.storyItems?.technologies?.length ? null : project.technologies.length ? project.technologies.join(" / ") : null), items: project.storyItems?.technologies, conclusion: project.technologyConclusion },
          { title: "Desafios e soluções", text: project.challenges, items: project.storyItems?.challenges },
          { title: "Resultados e aprendizados", text: project.learnings },
        ].map(({ title, text, items, conclusion }) => <section className={styles.storyBlock} key={title}>
          <h3>{title}</h3>
          {text ? text.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>) : !items?.length && <p className={styles.storyPending}>Texto em preparação.</p>}
          {Boolean(items?.length) && <ul className={styles.storyList}>{items?.map((item) => <li key={item.title}>
            <p><strong>{item.title}:</strong> {item.text}</p>
            {item.solution && <p><strong>Solução:</strong> {item.solution}</p>}
          </li>)}</ul>}
          {conclusion && <p className={styles.storyConclusion}>{conclusion}</p>}
        </section>)}
      </div>
    </section>
    <nav className={styles.detailNext} aria-label="Próximo projeto"><span>Continue pelos projetos</span><Link href={`/projetos/${next.slug}`}>{next.name}<Arrow /></Link></nav>
  </main><Footer /></div>;
}
