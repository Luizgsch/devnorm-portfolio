import Link from "next/link";
import { servicePricing } from "@/lib/service-pricing";
import { Arrow } from "./SiteChrome";
import styles from "./services-pricing.module.css";

export default function ServicesPricing() {
  return <section id="servicos" className={styles.section} aria-labelledby="services-title">
    <header className={styles.heading}>
      <h2 id="services-title">O que posso criar<br /><span>para você</span></h2>
      <p>Serviços digitais com escopo definido para a necessidade do seu negócio. Estes valores ajudam a planejar o investimento; cada proposta é ajustada após uma conversa.</p>
    </header>
      <div className={styles.grid}>
        {servicePricing.map((service) => <article key={service.number} className={styles.card} aria-labelledby={`service-${service.number}`}>
          <h3 id={`service-${service.number}`}>{service.name}</h3>
          <p className={styles.price}>
            <span className={styles.priceLabel}>{service.price.slice(0, service.price.indexOf("R$"))}</span>
            <strong>{service.price.slice(service.price.indexOf("R$"))}</strong>
          </p>
          <p className={styles.description}>{service.description}</p>
        </article>)}
      </div>
    <footer className={styles.footer}>
      <p className={styles.scope}>Os valores são referências para projetos com escopo definido. Uma entrega de escopo reduzido pode receber uma proposta menor; mais páginas, funcionalidades, integrações, conteúdo e personalização aumentam o investimento. Sites interativos e sistemas são orçados após a avaliação do que será desenvolvido.</p>
      <div className={styles.contact}>
        <p>Tem uma ideia ou um problema para resolver? Conte o que você precisa.</p>
        <Link href="/#contato" className={styles.button}>Pedir um orçamento <Arrow /></Link>
      </div>
    </footer>
  </section>;
}
