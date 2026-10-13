export const proposals = [
  { slug: "cinema", number: "01", name: "Cinema editorial", description: "O filme ocupa a tela. Tipografia serifada no espaço livre superior; nome e ações nas margens inferiores. Projetos como uma exposição, com imagem ao centro e ficha lateral.", tradeoff: "Mais atmosfera, com a oferta em duas linhas e navegação discreta." },
  { slug: "diptico", number: "02", name: "Díptico rubro", description: "Uma coluna editorial em bordô encontra o filme em enquadramento inteiro. Letras condensadas, alinhamento firme e projetos panorâmicos com legendas na base.", tradeoff: "Mais direto e comercial, com o filme dividido com a apresentação." },
  { slug: "cartaz", number: "03", name: "Cartaz de autor", description: "O nome ocupa o alto como uma assinatura de cartaz. A oferta e as ações ficam na base; os projetos ganham títulos amplos e imagens verticais ao centro.", tradeoff: "Mais presença de marca, com a oferta ancorada na faixa inferior." },
] as const;

export type ProposalSlug = (typeof proposals)[number]["slug"];

export { projects } from "@/lib/portfolio";
