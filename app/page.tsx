import Link from "next/link";
import Image from "next/image";
import developerPortrait from "@/public/media/desenvolvedor.png";
import { projects, technologyGroups } from "@/lib/portfolio";
import { getContactChannels, isContactConfigured } from "@/lib/site-config";
import Video from "./propostas/Video";
import ContactForm from "./components/ContactForm";
import TechnologyRibbon from "./components/TechnologyRibbon";
import TechnologyGroup from "./components/TechnologyGroup";
import HeroAboutTransition from "./components/HeroAboutTransition";
import ServicesPricing from "./components/ServicesPricing";
import { Arrow, Footer, Header } from "./components/SiteChrome";
import styles from "./site.module.css";

// Read server-only contact configuration at request time, including after deployment.
export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ demanda?: string }> }) {
  const channels = getContactChannels();
  const { demanda } = await searchParams;
  return <div className={styles.site} id="inicio">
    <a className={styles.skipLink} href="#sobre">Pular para o conteúdo</a>
    <main>
      <HeroAboutTransition>
      <section className={styles.hero} aria-labelledby="hero-title">
        <Video filmClassName={styles.film} controlClassName={styles.filmControl} playOnMobile />
        <Header home />
        <div className={styles.heroCopy}><h1 id="hero-title">Luiz <span>Schreiner</span></h1><p className={styles.heroSubtitle}>desenvolvedor - criador de sites</p></div>
      </section>

      <section className={`${styles.section} ${styles.about}`} id="sobre" aria-labelledby="about-title">
        <div className={styles.aboutHeading}>
          <h2 id="about-title" className={styles.aboutStatement}>
            <span className={styles.aboutTitleFirst}>Conheça <span>o</span></span>
            <span className={styles.aboutTitleLast}>desenvolvedor</span>
          </h2>
          <p className={styles.aboutGreeting}>Prazer, Luiz.</p>
        </div>
        <div className={styles.aboutMain}>
          <div className={styles.aboutPortrait}>
            <Image src={developerPortrait} alt="Luiz Schreiner, desenvolvedor da dev_norm" sizes="(max-width: 700px) 86vw, 43vw" />
            <svg className={styles.aboutPortraitBorder} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <rect x="0" y="0" width="100" height="100" fill="none" stroke="#000" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div className={styles.aboutBody}>
            <p>Sou Luiz Gustavo Schreiner de Oliveira, desenvolvedor de software por trás da dev_norm, com experiência em desenvolvimento web, backend e suporte de TI. Crio sites, sistemas e automações pensando primeiro no problema que precisa ser resolvido e em como a tecnologia pode tornar processos mais simples, organizados e eficientes.</p>
            <p>Hoje também atuo como freelancer, desenvolvendo soluções para empresas que querem melhorar sua presença digital, reduzir tarefas manuais e transformar ideias em produtos funcionais.</p>
            <Link className={styles.aboutMore} href="/sobre">Saiba mais sobre mim <Arrow /></Link>
          </div>
        </div>
      </section>

      </HeroAboutTransition>

      <section id="projetos" aria-labelledby="projects-title" className={styles.projects}>
        <div className={styles.workIntro}><h2 id="projects-title">Projetos</h2></div>
        {projects.map((project, index) => <article className={styles.project} key={project.slug} aria-labelledby={`title-${project.slug}`} style={{ zIndex: index + 1 }}>
          <div className={styles.projectBackdrop} style={{ backgroundImage: `url(${project.image})` }} aria-hidden="true" /><div className={styles.projectWash} />
          <div className={styles.projectNumber}><span>Projeto</span><strong>{project.number}</strong></div>
          <Link className={styles.projectImage} href={`/projetos/${project.slug}`} aria-label={`Ver projeto ${project.name}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.image} alt={project.imagePending ? `Espaço reservado para a imagem de ${project.name}. Imagem em preparação.` : project.name} width={1000} height={800} loading="lazy" />
            <span className={styles.imageAction}><Arrow /><span>Ver projeto</span></span>
          </Link>
          <div className={styles.projectInfo}><h3 id={`title-${project.slug}`}>{project.name}</h3><p>{project.nature ?? "Natureza do trabalho a confirmar"}</p><Link href={`/projetos/${project.slug}`}>Conhecer o projeto <Arrow /></Link></div>
          {project.imagePending && <p className={styles.projectNote}>Imagem do projeto em preparação</p>}
        </article>)}
        <div className={styles.moreProjects}><Link href="/projetos">Veja mais projetos <Arrow /></Link></div>
      </section>

      <ServicesPricing />

      <section className={`${styles.section} ${styles.technologies}`} id="tecnologias" aria-labelledby="technologies-title">
        <TechnologyRibbon />
        <div className={styles.technologyIntro}><h2 id="technologies-title">tecnologias que eu uso</h2></div>
        <div className={styles.technologyList}>{technologyGroups.map((group, index) => <TechnologyGroup key={group.name} name={group.name} tools={group.tools} initiallyOpen={index === 0} />)}</div>
      </section>

      <section className={`${styles.section} ${styles.contact}`} id="contato" aria-labelledby="contact-title">
        <div className={styles.contactIntro}><h2 id="contact-title">O que você<br />quer <em>resolver?</em></h2><p>Conte o que precisa construir ou o que está dificultando sua rotina. Não precisa chegar com uma solução pronta.</p><div className={styles.contactChannels}>{channels.map((channel) => channel.href ? <a key={channel.label} href={channel.href}><span>{channel.label}<strong>{channel.value}</strong></span><Arrow /></a> : <div key={channel.label}><span>{channel.label}<strong>{channel.value}</strong></span></div>)}</div>{channels.some((channel) => !channel.href) && <p className={styles.exampleNote}>Contatos ilustrativos nesta prévia.</p>}<span className={styles.contactSignature}>Luiz Schreiner / dev_norm</span></div>
        <ContactForm key={demanda ?? "general"} available={isContactConfigured()} initialDemand={demanda} />
      </section>
    </main>
    <Footer channels={channels} />
  </div>;
}
