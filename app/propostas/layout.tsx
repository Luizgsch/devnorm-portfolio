import type { Metadata } from "next";
import { condensed, editorial, sans } from "../fonts";
import "./propostas.css";

export const metadata: Metadata = {
  title: { default: "dev_norm — Três direções visuais", template: "%s | dev_norm" },
  description: "Propostas de hero e projetos para o portfólio de Luiz Schreiner.",
  robots: { index: false, follow: false },
};

export default function ProposalsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`proposal-root ${editorial.variable} ${sans.variable} ${condensed.variable}`}>{children}</div>;
}
