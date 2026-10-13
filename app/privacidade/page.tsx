import Link from "next/link";
import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import styles from "../site.module.css";

export const metadata: Metadata = { title: "Privacidade no formulário" };

export default function Privacy() {
  return <div className={styles.site} id="inicio"><Header /><main className={styles.reading}><h1>Seus dados<br /><em>nesta conversa.</em></h1><p>O formulário solicita nome, e-mail ou WhatsApp, tipo de demanda e uma descrição. Essas informações servem para entender a solicitação e responder pelo canal escolhido.</p><h2>Quando você envia</h2><p>Quando o envio está disponível, as informações são encaminhadas por e-mail usando o serviço Resend. O site só confirma o envio depois de receber o aceite desse serviço. A confirmação não indica que o e-mail já foi lido.</p><h2>Enquanto o envio está indisponível</h2><p>Os campos permanecem no navegador. A opção “Copiar mensagem” coloca o texto na sua área de transferência; ela não envia a mensagem.</p><h2>Uso das informações</h2><p>Não envie senhas, credenciais ou dados que não sejam necessários para explicar a demanda. Esta implementação não adiciona ferramentas de publicidade ou rastreamento de visitantes. O provedor de hospedagem e o serviço de e-mail podem manter registros operacionais.</p><p>Os canais identificados como exemplos são ilustrativos. Os contatos reais serão disponibilizados antes da publicação do site.</p><Link className={styles.textAction} href="/#contato">Voltar ao contato</Link></main><Footer /></div>;
}
