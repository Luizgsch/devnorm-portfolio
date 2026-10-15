import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectGallery from "../../../components/ProjectGallery";
import { projects } from "../../content";

export function generateStaticParams() { return projects.map((item) => ({ slug: item.slug })); }

export default async function ProjectDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return <main className="notes-page"><Link className="back-link" href="/propostas">Voltar às propostas</Link><h1>{project.name}</h1><p>{project.context ?? "Veja as imagens do projeto na galeria abaixo."}</p>
    <ProjectGallery name={project.name} images={project.images} />
    <dl className="pending-fields"><div><dt>Contexto</dt><dd>A completar: qual problema motivou o projeto e para quem foi desenvolvido.</dd></div><div><dt>Natureza</dt><dd>A confirmar: trabalho contratado, projeto pessoal ou estudo.</dd></div><div><dt>Desenvolvimento</dt><dd>A completar: sua participação e funcionalidades implementadas.</dd></div><div><dt>Tecnologias</dt><dd>A confirmar com o código ou a documentação do projeto.</dd></div><div><dt>Imagens e links</dt><dd>Quatro capturas na galeria acima. Links públicos ainda não informados.</dd></div></dl>
    <p>Nenhum resultado, cliente ou funcionalidade foi presumido nesta proposta.</p><Link className="back-link" href="/propostas">Comparar direções visuais</Link>
  </main>;
}
