import type { Metadata } from "next";
import { condensed, editorial, hero, sans } from "./fonts";
import SmoothScrolling from "./components/SmoothScrolling";
import Preloader from "./components/Preloader";
import { HERO_POSTER_SRC } from "@/lib/hero-media";
import { preloadBootstrap } from "@/lib/preload";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./preloader.css";

export const metadata: Metadata = {
  title: { default: "dev_norm — Luiz Schreiner | Sites, sistemas e automações", template: "%s | dev_norm" },
  description: "Luiz Schreiner, desenvolvedor de software. Sites, sistemas e automações para dar presença digital, organizar processos e facilitar o atendimento.",
  applicationName: "dev_norm",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href={HERO_POSTER_SRC} />
        <script dangerouslySetInnerHTML={{ __html: preloadBootstrap }} />
        <noscript><style>{`.preloader { display: none !important; } .siteContent { visibility: visible !important; } html { overflow: auto !important; }`}</style></noscript>
      </head>
      {/* Browser extensions can inject body attributes before React hydrates. */}
      <body suppressHydrationWarning className={`${editorial.variable} ${hero.variable} ${sans.variable} ${condensed.variable}`}><Preloader><SmoothScrolling />{children}</Preloader></body>
    </html>
  );
}
