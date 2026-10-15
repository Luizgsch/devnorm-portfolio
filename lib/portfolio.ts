export type Project = {
  slug: string;
  number: string;
  name: string;
  image: string;
  images: string[];
  imagePending: boolean;
  nature: string | null;
  context: string | null;
  development: string | null;
  technologies: string[];
  technologyDescription?: string;
  technologyConclusion?: string;
  motivation?: string;
  challenges?: string;
  learnings?: string;
  storyItems?: Partial<Record<"development" | "technologies" | "challenges", { title: string; text: string; solution?: string }[]>>;
};

// These are names supplied by Luiz. Add only verified case information here.
export const projects: Project[] = [
  {
    slug: "rango-de-rua", number: "01", name: "Rango de Rua", image: "/media/ONG1.png",
    images: [1, 2, 3, 4].map((number) => `/media/ONG${number}.png`), imagePending: false,
    nature: "Desenvolvedor Full Stack voluntário",
    context: "O Rango de Rua é uma plataforma web desenvolvida para apoiar a organização e gestão de voluntários de uma ONG. Trabalhei no projeto como desenvolvedor Full Stack voluntário, participando da construção da aplicação, da integração entre frontend e backend e da estruturação dos dados.\n\nA proposta era transformar um processo que poderia ser feito de forma dispersa ou manual em uma aplicação centralizada, facilitando o cadastro, a consulta e o gerenciamento das informações dos voluntários.",
    motivation: "Entrei no projeto pela oportunidade de aplicar desenvolvimento de software em um contexto real e contribuir com uma organização que precisava de uma solução prática.\n\nAté então, boa parte da minha experiência vinha de estudos e projetos próprios. Trabalhar com uma ONG trouxe uma perspectiva diferente: existia uma necessidade real, pessoas envolvidas e um sistema que precisava fazer sentido fora do ambiente de estudo.\n\nAlém de contribuir com a organização, o projeto foi uma oportunidade importante para desenvolver minha experiência trabalhando em uma aplicação completa.",
    development: "Foi desenvolvida uma aplicação web para gerenciamento de voluntários, permitindo cadastrar, consultar e organizar as informações utilizadas pela ONG.\n\nAtuei tanto no frontend quanto no backend da aplicação. No backend, desenvolvemos APIs REST responsáveis pela comunicação com o banco de dados e pelas operações relacionadas aos voluntários.\n\nNo frontend, essas APIs foram integradas à interface para que as informações pudessem ser cadastradas, visualizadas e gerenciadas de forma simples.\n\nTambém participei da integração entre as diferentes partes da aplicação e do processo de disponibilização do sistema online.",
    technologies: ["React", "TypeScript", "Node.js", "APIs REST", "PostgreSQL", "Git", "GitHub", "Vercel", "Render"],
    technologyDescription: "A aplicação foi construída utilizando:",
    technologyConclusion: "O projeto me permitiu trabalhar com diferentes partes de uma aplicação web e entender melhor como frontend, backend, banco de dados e infraestrutura precisam funcionar em conjunto.",
    storyItems: {
      technologies: [
        { title: "React e TypeScript", text: "no frontend;" },
        { title: "Node.js", text: "no backend;" },
        { title: "APIs REST", text: "para comunicação entre as camadas;" },
        { title: "PostgreSQL", text: "para persistência dos dados;" },
        { title: "Git e GitHub", text: "para versionamento;" },
        { title: "Vercel", text: "para hospedagem do frontend;" },
        { title: "Render", text: "para disponibilização do backend." },
      ],
    },
    challenges: "Um dos principais desafios foi garantir que frontend, backend e banco de dados trabalhassem corretamente como uma única aplicação.\n\nDurante o desenvolvimento, algumas mudanças geravam inconsistências entre os dados enviados pela interface, o formato esperado pela API e o que era armazenado no banco. Isso exigiu analisar cada etapa do fluxo separadamente para encontrar a origem dos problemas.\n\nPassei a validar as alterações em etapas menores: primeiro verificando os dados enviados pelo frontend, depois o processamento realizado pela API e, por último, a persistência no banco.\n\nEsse processo me ensinou a evitar alterações muito grandes de uma vez e a investigar problemas de forma mais estruturada.",
    learnings: "O projeto resultou em uma aplicação funcional para cadastro e gerenciamento de voluntários, reunindo frontend, backend, banco de dados e deploy em uma solução completa.\n\nMais importante do que o resultado técnico foi a experiência de desenvolver para uma necessidade real. Percebi que construir software envolve muito mais do que fazer uma funcionalidade funcionar: é necessário entender quem vai utilizar o sistema, organizar prioridades, lidar com mudanças e garantir que diferentes partes da aplicação permaneçam integradas.\n\nTambém evoluí bastante na forma como investigo problemas. Em vez de tentar alterar várias coisas ao mesmo tempo, passei a isolar cada etapa do fluxo e validar onde o comportamento começa a divergir do esperado.\n\nFoi uma das experiências que ajudaram a consolidar meu interesse pelo desenvolvimento de software e pela criação de soluções que tenham utilidade fora do ambiente de estudo.",
  },
  {
    slug: "direito", number: "02", name: "Direito", image: "/media/Direito1.png",
    images: [1, 2, 3, 4].map((number) => `/media/Direito${number}.png`), imagePending: false,
    nature: "Projeto demonstrativo para profissional fictício",
    context: "Site demonstrativo de advocacia voltado ao Direito de Família e Sucessões. Criado para um profissional fictício, apresenta como um advogado pode organizar sua presença digital com clareza e uma identidade visual sofisticada.",
    motivation: "Desenvolvi o projeto para apresentar meu trabalho a advogados que pretendo abordar. A demonstração oferece uma referência concreta de como poderia ser um site criado por mim para esses profissionais.",
    development: "Uma homepage com apresentação, áreas de atuação, etapas de contato, perguntas frequentes e formulário para preparar e copiar mensagens. Também foram criadas páginas detalhadas sobre os assuntos jurídicos, apresentação do profissional e privacidade, além de navegação responsiva e rolagem suave.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "CSS", "Lenis", "Playwright", "axe-core", "Git", "GitHub Pages", "GitHub Actions"],
    technologyDescription: "Next.js, React, TypeScript, Tailwind CSS e CSS personalizado. Lenis para rolagem suave, Playwright para testes e axe-core para verificações de acessibilidade. Versionamento com Git e publicação no GitHub Pages por GitHub Actions.",
    challenges: "O principal desafio foi equilibrar uma apresentação sofisticada com leitura confortável e navegação simples. Trabalhei a tipografia, os contrastes e a organização das seções, ajustando a experiência para desktop e celular. Também adaptei o Next.js para publicação estática, corrigindo caminhos de arquivos, imagens e links.",
    learnings: "O resultado foi uma demonstração funcional, publicada e preparada para adaptação a um profissional real. O projeto aprofundou minha experiência com acessibilidade, responsividade, testes e publicação automatizada. Também reforçou a importância de apresentar claramente os limites de uma demonstração, sem inventar credenciais, clientes ou resultados jurídicos.",
  },
  {
    slug: "command-center", number: "03", name: "Command Center", image: "/media/Jornada1.png",
    images: [1, 2, 3, 4].map((number) => `/media/Jornada${number}.png`), imagePending: false, nature: null,
    context: "O Posigraf — HR & Ops Core é uma plataforma integrada de gestão desenvolvida para centralizar, automatizar e modernizar a operação das áreas de Recursos Humanos (DHO), Logística/Serviços Gerais e Financeiro. O software atua como um Command Center inteligente, criado para substituir processos manuais e a dependência excessiva de planilhas de Excel pulverizadas por um ecossistema digital unificado, rápido e intuitivo.",
    motivation: "Percebi que a dependência de planilhas manuais e o tempo gasto em tarefas repetitivas eram uma dor universal no mercado, travando o potencial estratégico de grandes empresas. A motivação para criar este projeto foi transformar essa realidade: utilizar a tecnologia para eliminar o retrabalho, evitar falhas humanas e devolver tempo para que as pessoas possam focar no que realmente importa — a gestão estratégica e o cuidado com o fator humano.",
    development: "Foi desenvolvida a interface de usuário (Front-end) e a arquitetura do produto, integrando quatro vertentes operacionais essenciais:",
    technologies: ["React", "Tailwind CSS", "Lucide React", "JSON Mocks"],
    learnings: "O projeto resultou em uma proposta de software robusta, validada contra mais de 50 gargalos operacionais reais da empresa. Como principal aprendizado, compreendi que o papel do desenvolvedor moderno vai além de escrever código: é preciso entender profundamente os processos de negócios da empresa e criar tecnologias que se adaptem ao fluxo real das pessoas, unindo eficiência operacional a uma experiência humana e gratificante.",
    storyItems: {
      development: [
        { title: "RH (DHO)", text: "Triagem automatizada de candidatos com Match Score por IA, gestão visual de vagas e controle de SLAs de contratação." },
        { title: "Logística e Serviços Gerais", text: "Controle de uniformes, gestão de insumos, acompanhamento de manutenção e automação de indicadores do refeitório." },
        { title: "Financeiro", text: "Módulo de auditoria e cruzamento automático de dados para prevenção de erros em faturamentos e pagamentos de benefícios." },
        { title: "Estacionamento Visual", text: "Mapa interativo do pátio para controle de vagas em tempo real, integrando a identificação por crachá a um sistema de alerta automático para duplicidade de Vale Transporte (VT)." },
      ],
      technologies: [
        { title: "React", text: "Construção de uma interface declarativa, moderna e componenteizada." },
        { title: "Tailwind CSS", text: "Estilização ágil baseada em utilitários, garantindo um design responsivo e temas customizados." },
        { title: "Lucide React", text: "Biblioteca de iconografia limpa para reforçar a hierarquia visual." },
        { title: "JSON Mocks", text: "Estrutura de dados simulados para reproduzir o comportamento dinâmico de um ambiente de produção real." },
      ],
      challenges: [
        { title: "Desafio 1", text: "Complexidade e densidade de dados nas telas.", solution: "Adotei o layout Bento Box, organizando informações densas em blocos visuais intuitivos com hierarquia clara e Dark Mode, reduzindo o cansaço visual e facilitando tomadas de decisão rápidas." },
        { title: "Desafio 2", text: "Auditoria e controle financeiro de benefícios (VT vs. Estacionamento).", solution: "Projetei um fluxo de check-in simplificado na portaria por número de crachá que cruza dados em tempo real e dispara alertas visuais imediatos ao identificar o uso do pátio por colaboradores que possuem Vale Transporte ativo." },
        { title: "Desafio 3", text: "Transição suave do modelo antigo (Excel) para o novo.", solution: "Desenvolvi a solução com suporte à ingestão de dados das planilhas que a empresa já utilizava, garantindo facilidade de migração sem interromper a rotina diária." },
      ],
    },
  },
];

export const technologyGroups = [
  { name: "Frontend", tools: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Angular", "Tailwind"] },
  { name: "Backend", tools: ["Node.js", "Java", "Spring Boot", "Python"] },
  { name: "Design", tools: ["Photoshop", "Canva", "Figma"] },
  { name: "Animações & 3D", tools: ["GSAP", "Lenis", "Three.js"] },
  { name: "Banco de dados", tools: ["MySQL", "MongoDB", "PostgreSQL", "MariaDB", "Supabase"] },
  { name: "DevOps & Tools", tools: ["Docker", "Vercel", "Git", "GitHub"] },
  { name: "Inteligência artificial", tools: ["ChatGPT", "Codex", "Antigravity", "Claude Code", "v0"] },
];
