import Link from "next/link";

export default function Scope() {
  return <main className="notes-page"><Link className="back-link" href="/propostas">Voltar às propostas</Link><h1>O restante vem<br /><em>com sua escolha.</em></h1><p>Estas são notas de conteúdo. A composição das próximas seções será desenvolvida depois da aprovação do hero e dos projetos.</p>
    <section id="sobre"><h2>Sobre mim</h2><p>Luiz Schreiner, desenvolvedor de software. Construo interfaces, backends e soluções para organizar processos, facilitar atendimento e dar presença digital aos negócios. Meu foco inclui Java/Spring Boot e desenvolvimento web com React/Next.js.</p></section>
    <section id="servicos"><h2>Serviços</h2><p>Sites institucionais, landing pages, sistemas sob medida para necessidades simples, automações de tarefas, integrações, soluções de atendimento por WhatsApp e manutenção de projetos existentes.</p></section>
    <section id="tecnologias"><h2>Tecnologias</h2><p>Java/Spring Boot e React/Next.js fazem parte do foco informado. JavaScript/TypeScript, Node.js, Python/FastAPI, PostgreSQL e MongoDB aguardam validação para a apresentação final.</p></section>
    <section id="contato"><h2>Contato</h2><p>O convite será direto: descreva seu projeto ou o problema que precisa resolver.</p><p><strong>Falta definir:</strong> e-mail, WhatsApp ou outro canal público. Nenhum canal ou serviço de envio foi encontrado no repositório. O formulário será integrado na próxima etapa, após definição do destino.</p></section>
    <Link className="back-link" href="/propostas">Comparar as três direções</Link>
  </main>;
}
