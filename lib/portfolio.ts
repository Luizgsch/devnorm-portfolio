export type Project = {
  slug: string;
  number: string;
  name: string;
  image: string;
  imagePending: boolean;
  nature: string | null;
  context: string | null;
  development: string | null;
  technologies: string[];
};

// These are names supplied by Luiz. Add only verified case information here.
export const projects: Project[] = [
  { slug: "rango-de-rua", number: "01", name: "Rango de Rua", image: "/media/rango-de-rua-pendente.svg", imagePending: true, nature: null, context: null, development: null, technologies: [] },
  { slug: "avx", number: "02", name: "AVX", image: "/media/avx-pendente.svg", imagePending: true, nature: null, context: null, development: null, technologies: [] },
  { slug: "command-center", number: "03", name: "Command Center", image: "/media/command-center-pendente.svg", imagePending: true, nature: null, context: null, development: null, technologies: [] },
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
