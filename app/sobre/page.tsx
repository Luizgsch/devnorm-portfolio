import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import portrait from "@/public/media/desenvolvedor.png";
import { Arrow, Footer, Header } from "../components/SiteChrome";
import site from "../site.module.css";
import styles from "./sobre.module.css";

export const metadata: Metadata = {
  title: "Sobre Luiz Schreiner",
  description: "Conheça Luiz Gustavo Schreiner de Oliveira, desenvolvedor por trás da dev_norm. Desenvolvimento web, backend e suporte de TI.",
};

export default function AboutPage() {
  return <div className={`${site.site} ${styles.page}`} id="inicio">
    <a className={site.skipLink} href="#biografia">Pular para o conteúdo</a>
    <Header />
    <main>
      <section className={styles.opening} aria-labelledby="about-heading">
        <Link className={`${site.aboutMore} ${styles.back}`} href="/#sobre">Voltar para Sobre mim <Arrow /></Link>
        <div className={styles.titleBlock}>
          <h1 id="about-heading">Por trás<br />da <em>dev_norm</em></h1>
        </div>
        <div className={styles.portraitBlock}>
          <figure className={styles.portrait}>
            <Image src={portrait} alt="Retrato de Luiz Gustavo Schreiner de Oliveira" sizes="(max-width: 700px) 76vw, 34vw" preload />
            <figcaption>Luiz Gustavo Schreiner de Oliveira<span>Desenvolvedor de software</span></figcaption>
          </figure>
        <article className={styles.prose} id="biografia" aria-label="Sobre Luiz Schreiner">
          <p>Sou Luiz Schreiner, desenvolvedor de software e estudante de Engenharia de Software em Curitiba.</p>
          <p>Meu contato com tecnologia começou muito antes de pensar em trabalhar profissionalmente com desenvolvimento. Sempre tive interesse por computadores, hardware e por entender como as coisas funcionavam por trás da tela. Esse interesse me levou primeiro para a área técnica, estudando hardware e informática, e depois naturalmente para programação, desenvolvimento de sistemas e engenharia de software.</p>
          <p>Hoje minha experiência passa por diferentes áreas da tecnologia. Trabalho com suporte de TI, lidando com diagnóstico de problemas, manutenção de hardware e software, sistemas operacionais e atendimento técnico. Ao mesmo tempo, desenvolvo aplicações web, APIs, sistemas e automações, principalmente utilizando Java, Spring Boot, TypeScript, React, Next.js, Node.js, PostgreSQL e MongoDB.</p>
          <p>Essa combinação entre suporte e desenvolvimento acabou moldando bastante a forma como eu enxergo tecnologia. Gosto de entender o problema antes de pensar na ferramenta. Para mim, uma boa solução precisa funcionar bem tecnicamente, mas também precisa fazer sentido para quem vai usar e para o negócio que está por trás dela.</p>
          <p>Ao longo dos meus projetos, já trabalhei com desenvolvimento frontend e backend, APIs REST, autenticação, bancos de dados, integrações entre sistemas e aplicações completas. Também participei de projetos voluntários e acadêmicos, além de construir soluções próprias para aprofundar meus conhecimentos e transformar teoria em experiência prática.</p>
          <p>Foi dessa vontade de criar soluções úteis para problemas reais que nasceu a dev_norm.</p>
          <p>Criei a dev_norm como minha marca para desenvolver sites, sistemas, automações e soluções digitais para empresas. A ideia é ir além de simplesmente entregar um site ou escrever código. Quero entender como a empresa funciona, onde existem tarefas manuais, processos confusos ou oportunidades de melhorar atendimento, organização e presença digital, e então transformar isso em uma solução que realmente tenha utilidade.</p>
          <p>Também vejo a dev_norm como parte da minha própria evolução profissional. Cada projeto é uma oportunidade de aprender mais sobre desenvolvimento, produto, design, experiência do usuário, negócios e relacionamento com clientes.</p>
          <p>Estou constantemente estudando, experimentando novas tecnologias, desenvolvendo projetos e aprimorando minha forma de construir software. Ainda tenho muito para aprender, e isso faz parte do que mais gosto na área: tecnologia muda o tempo todo, e sempre existe alguma coisa nova para entender, testar e melhorar.</p>
          <p>Meu objetivo é continuar evoluindo como desenvolvedor enquanto construo soluções cada vez melhores para pessoas e empresas, combinando conhecimento técnico, pensamento crítico e uma abordagem prática para transformar problemas em produtos funcionais.</p>
          <div className={styles.signature}><span>Luiz Schreiner</span><span>dev_norm</span></div>
        </article>
        </div>
      </section>

      <section className={styles.closing} aria-labelledby="closing-heading">
        <h2 id="closing-heading">Sua ideia.<br /><em>Nosso próximo projeto.</em></h2>
        <Link className={site.aboutMore} href="/#contato">Vamos conversar <Arrow /></Link>
      </section>
    </main>
    <Footer />
  </div>;
}
