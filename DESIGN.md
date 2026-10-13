---
name: "dev_norm — Cartaz de autor"
description: "Sistema aprovado do portfólio de Luiz Schreiner: nome em EB Garamond, leitura editorial e atmosfera de vinho."
colors:
  ink: "#100d0e"
  hero-red: "#4e0007"
  about-red: "#7f0711"
  about-text: "#f2d7d3"
  about-action-line: "#e9aba9"
  about-signature-line: "#b35d62"
  project-stage: "#1a191a"
  paper: "#f2e9dc"
  muted: "#c4b6aa"
  wine: "#641426"
  wine-hover: "#812139"
  gold: "#c8ae7f"
  line: "#4c393d"
  rose: "#d598a0"
  services: "#390b16"
  services-text: "#d5b8bf"
  contact: "#1c1015"
  field: "#25161d"
  field-border: "#856471"
  placeholder: "#bdaaaf"
  error: "#ffc6d1"
  invalid-border: "#f4acb9"
  image-hover: "#fff9f0"
typography:
  display:
    fontFamily: "EB Garamond, serif"
    fontSize: "clamp(72px, 9vw, 140px)"
    fontWeight: 500
    lineHeight: 0.92
    letterSpacing: "-.035em"
  display-projects:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(110px, 18vw, 260px)"
    fontWeight: 600
    lineHeight: 0.8
    letterSpacing: "-.03em"
  display-about:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(64px, 11.8vw, 180px)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-.03em"
  display-services:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(60px, 6.6vw, 92px)"
    fontWeight: 600
    lineHeight: 0.99
    letterSpacing: "-.02em"
  headline:
    fontFamily: "Bodoni Moda, serif"
    fontSize: "clamp(38px, 4.2vw, 60px)"
    fontWeight: 450
    lineHeight: 1.13
    letterSpacing: "-.025em"
  title-project:
    fontFamily: "Bodoni Moda, serif"
    fontSize: "clamp(44px, 5.7vw, 82px)"
    fontWeight: 450
    lineHeight: 1.15
    letterSpacing: "-.03em"
  title-service:
    fontFamily: "Bodoni Moda, serif"
    fontSize: "clamp(28px, 2.5vw, 37px)"
    fontWeight: 450
    lineHeight: 1.2
    letterSpacing: "-.025em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    lineHeight: 1.7
  body-editorial:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    lineHeight: 1.85
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "13px"
    lineHeight: 1.7
rounded:
  square: "0px"
  pill: "999px"
spacing:
  compact: "12px"
  mobile-gutter: "24px"
  group: "32px"
  section-mobile: "70px"
  section-desktop: "120px"
  header-gutter: "5%"
  content-gutter: "7%"
components:
  action-primary:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "14px 21px"
  action-primary-hover:
    backgroundColor: "{colors.wine-hover}"
  action-secondary:
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
  action-more-projects:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "16px 24px"
  image-action:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "12px"
    rounded: "{rounded.square}"
  image-action-hover:
    backgroundColor: "{colors.image-hover}"
  input:
    backgroundColor: "{colors.field}"
    textColor: "{colors.paper}"
    rounded: "{rounded.square}"
    padding: "12px 14px"
  navigation:
    textColor: "{colors.paper}"
    typography: "{typography.label}"
  about-poster:
    backgroundColor: "{colors.about-red}"
    textColor: "{colors.paper}"
    typography: "{typography.display-about}"
    rounded: "{rounded.square}"
    padding: "100px 7%"
  service-row:
    backgroundColor: "{colors.services}"
    textColor: "{colors.paper}"
    padding: "42px 0"
---

# Design System: dev_norm — Cartaz de autor

## Overview

**Creative North Star: "Cartaz de autor"**

Cartaz de autor, a terceira proposta da rodada `7b490e2c`, foi escolhida explicitamente pelo usuário em 1 de outubro de 2026. Este documento atualiza o sistema anterior para descrever a implementação aprovada da página principal e suas fichas de projeto. A direção visual está aprovada; imagens reais, informações dos projetos e canais públicos continuam pendentes.

O nome no hero ganha escala em EB Garamond; Bodoni Moda conduz títulos editoriais; Barlow Condensed marca Sobre, a abertura dos projetos e os serviços; Manrope sustenta textos, navegação e formulário. Vermelho `#4E0007` une o fundo móvel à cena do vídeo. Preto vinho, marfim e campos bordô mantêm a atmosfera dark academia contemporânea. Seções abertas, linhas finas e grandes imagens organizam a página, com pouca ornamentação. A rolagem dos projetos usa sobreposição de painéis fixos, solicitada depois pelo usuário.

**Key Characteristics:**

- Cartaz de autor é o sistema atual da página principal e das fichas.
- Nome em EB Garamond, títulos editoriais e leitura em Manrope, com fontes locais.
- Superfícies retas, grandes intervalos e separações por linhas ou cor.
- Imagem de projeto repetida como fundo ampliado e desfocado.
- Movimento restrito ao filme original e à sobreposição de projetos solicitada.

Evidência: `app/site.module.css`, `app/globals.css`, `app/fonts.ts`, `app/page.tsx`, `app/components/ContactForm.tsx`, `app/components/SiteChrome.tsx`, `app/projetos/[slug]/page.tsx` e `app/propostas/Video.tsx`. A escolha e as restrições estão em `PRODUCT.md` e `.impeccable/site-contract.md`. Os tokens de cor do site são locais ao contêiner da página; as famílias são carregadas pelo layout.

### Historical variants

As rotas `/propostas` preservam os estudos originais como arquivo de comparação. Cinema editorial usa oferta em Bodoni Moda e projeto quadrado; Díptico rubro usa painel bordô lateral, títulos condensados e projeto horizontal; Cartaz de autor tinha nome condensado e oferta serifada na base. O hero público foi refinado: nome em EB Garamond e base livre de texto e ações. As antigas composições, o comparador fixo e seus tokens particulares continuam no CSS das propostas. Eles não substituem o sistema atual nem compõem a navegação pública. O filme original, a paleta quente e os cantos retos permanecem confirmados.

## Colors

A paleta parte do preto vinho e do marfim, com bordô para ações e grandes campos, rosa envelhecido para ênfases e dourado pontual.

### Primary

- **Vermelho da cena** (`hero-red`): fundo do hero móvel e início do degradê abaixo da primeira viewport.
- **Bordô de ação** (`wine`, `wine-hover`): ação principal e seu estado imediato de hover; também colore a barra de rolagem.
- **Vermelho do desenvolvedor** (`about-red`): campo de Sobre; `about-text` sustenta a biografia, `about-action-line` marca o link e `about-signature-line` separa a assinatura.
- **Campo bordô** (`services`): fundo dos serviços e da continuação entre projetos. Seu texto auxiliar usa `services-text`.
- **Rosa envelhecido** (`rose`): palavras enfatizadas e identificação de conteúdo ilustrativo; não substitui a hierarquia tipográfica.

### Secondary

- **Dourado envelhecido** (`gold`): foco visível e contagem de projetos.

### Neutral

- **Preto vinho** (`ink`): fundo geral e texto sobre ações claras.
- **Marfim** (`paper`): texto principal e ação sobre a imagem; `image-hover` ilumina essa ação no hover.
- **Pedra quente** (`muted`): leitura auxiliar, descrições e informações secundárias.
- **Linha vinho** (`line`): separações em assinaturas, tecnologias, contato e fichas.
- **Campo de contato** (`contact`) e **campo de entrada** (`field`): variações tonais para distinguir a seção e seus controles.
- **Contorno de entrada** (`field-border`) e **texto de exemplo** (`placeholder`): identificação dos campos vazios.
- **Rosa de erro** (`error`, `invalid-border`): mensagem de erro e borda de campo inválido, sempre acompanhadas de texto.

**The Cor com Função Rule.** Bordô identifica ações e campos amplos; dourado identifica foco e contagem; erros permanecem explícitos em texto.

## Typography

**Display Font:** EB Garamond para o nome no hero, com fallback serif.
**Body Font:** Manrope, com fallback sans-serif.
**Editorial Font:** Bodoni Moda, com fallback serif.

As quatro fontes são locais. EB Garamond usa peso 500 no hero; Barlow Condensed usa peso 600 no cartaz Sobre, na abertura dos projetos e nos serviços; Bodoni Moda usa peso 450 nos demais títulos. O contraste de desenho distingue autoria, narrativa e interface sem depender de ornamentos.

### Hierarchy

- **Display:** nome em caixa mista no hero; projetos e serviços usam variantes condensadas.
- **Headline:** títulos editoriais serifados; o título semântico `h2` de Sobre usa `display-about`.
- **Title:** títulos de projeto e serviço usam os tokens próprios. Na ficha, o título principal usa `clamp(48px, 6vw, 86px)`, entrelinha 1.1 e tracking de -.035em.
- **Body:** base de 16px; biografia de 16px e entrelinha 1.85. Parágrafos extensos têm limites observados de 65–70ch.
- **Label:** navegação e ações usam 13px. Contagens usam algarismos tabulares.

Até 700px, o nome usa `clamp(56px, 13vw, 82px)`, entrelinha .9 e quebra entre nome e sobrenome; o cartaz Sobre usa `clamp(42px, 10.7vw, 75px)`, entrelinha .9 e tracking -.03em; o título de projeto usa 38px. A biografia usa 15px. Os campos passam a 16px. As variações específicas continuam no CSS, sem criar uma escala tipográfica adicional para cada seção.

**The Autoria e Leitura Rule.** EB Garamond dá voz ao nome; Barlow Condensed marca Sobre, projetos e serviços; Bodoni Moda conduz títulos editoriais; Manrope sustenta a leitura e os controles.

## Layout

O hero desktop ocupa 100svh, com mínimo de 760px e máximo de 1200px. Nome no alto e filme central definem a abertura; não há faixa inferior de oferta, ações ou legenda. O controle de pausa fica no alto à direita. O cabeçalho usa margem horizontal de 5%; seções internas usam 7%, com padding vertical recorrente de 120px. Sobre usa campo vermelho sólido, padding vertical de 100px e cartaz em toda a largura. Abaixo, retrato à esquerda e biografia à direita formam grade `1.05fr 1fr`, intervalo de 9% e margem superior de 64px.

Cada projeto forma uma seção aberta com título amplo, número à esquerda, imagem vertical central e ficha à direita. A grade é `1fr minmax(0, 1.8fr) 1fr`, com intervalo horizontal de 6%. A imagem ocupa 90% da coluna e usa proporção 4:5. Cada painel tem 100svh e mínimo de 760px no desktop, ou 690px no celular. A ficha individual usa imagem 16:8 e conteúdo em duas colunas.

Serviços se organizam em linhas, com título, descrição e ação de 44px. Tecnologias se agrupam por função, em texto aberto. Contato combina introdução e formulário em `1fr 1.2fr`; campos relacionados usam duas colunas quando há espaço.

Entre 701px e 1050px, o hero ocupa pelo menos 100svh ou 850px e o filme usa `contain`. Seções adotam padding de 90px 5%; Sobre mantém duas colunas com intervalo de 6% e biografia de 14px; pares de campos passam a uma coluna. Até 700px, margens ficam em 24px e seções em 70px verticais. O hero mantém ao menos 100svh, fundo `#4E0007`, nome centralizado e imagem com `contain`; Sobre usa padding superior de 64px e inferior de 70px; retrato e biografia se empilham, com intervalo e margem superior de 36px. Retrato centralizado, limitado a 440px e à largura disponível. Conteúdo, formulário e fichas seguem fluxo vertical. Projetos seguem número, imagem e ficha, com imagem a 88% da largura. A ficha individual usa imagem quadrada.

O cabeçalho móvel permite quebra dos links em linhas. Ações do formulário se empilham. O comparador das propostas não integra este layout.

## Elevation & Depth

As superfícies permanecem planas. A profundidade vem do filme, das diferenças tonais e da reprodução ampliada da própria imagem de projeto no fundo. Esse fundo usa desfoque de 24px e máscara `rgb(13 9 12 / 73%)`. Sobre usa campo vermelho plano, sem degradê de transição.

### Shadow Vocabulary

- **Imagem de projeto:** `0 32px 70px rgb(0 0 0 / 24%)`; sombra difusa sob a imagem central.

**The Profundidade da Imagem Rule.** Imagens criam atmosfera e profundidade; campos, navegação e linhas de serviço permanecem sem elevação.

## Shapes

Ações, imagens e campos usam cantos retos. Linhas de 1px distinguem grupos e ações secundárias; campo inválido usa linha inferior de 2px. Ícones são SVG de traço simples, com seta de 22px e áreas interativas de pelo menos 44px nos links de navegação e serviços. Não há sistema de chips ou cartões elevados na implementação atual.

## Components

### Buttons

A ação principal é bordô com texto marfim, padding de 14px 21px e altura mínima de 52px. Hover muda imediatamente o preenchimento. A ação secundária usa fundo transparente e linha inferior. Links comuns recebem sublinhado no hover; o foco global usa contorno dourado de 2px, afastado 5px. Não há transições.

O envio indisponível ou em andamento desabilita o botão. O estado indisponível exibe aviso e ação separada para copiar a mensagem. A ação de copiar usa texto e linha inferior, com hover rosa. Copiar e enviar possuem mensagens distintas.

### Inputs / Fields

Campos retos usam fundo tonal, borda inferior, padding de 12px 14px e altura mínima de 50px. Rótulos permanecem visíveis acima do controle. A área de texto tem mínimo de 150px e redimensionamento vertical. Foco segue o contorno dourado global; erro combina borda rosa, mensagem ligada ao campo e `aria-invalid`. Durante envio, o grupo fica desabilitado com opacidade .7. Mensagens de estado usam região viva; o primeiro campo inválido recebe foco.

### Navigation

Navegação textual em Manrope, links com mínimo de 44px de altura e hover sublinhado. O cabeçalho móvel quebra linhas sem menu oculto. Links de salto aparecem no foco. Rodapé reutiliza marca, links textuais e linhas finas. Contatos ilustrativos são texto sem links ativos; canais reais só entram quando configurados.

### Developer poster

Sobre apresenta o cartaz condensado em duas linhas, com régua horizontal antes de desenvolvedor. Retrato `public/media/desenvolvedor.png` fornecido pelo usuário como arquivo local, sem geração raster. Preservar proporção integral e texto alternativo identificando Luiz Schreiner. Biografia existente permanece à direita no desktop e abaixo no celular. Saudação oval com rotação estática de -7 graus, link para serviços e assinatura com divisor fino completam a coluna.

### Project image and dossier

A imagem e a ação textual levam à mesma ficha. A ação clara sobreposta mostra SVG e texto. O fundo reutiliza a imagem desfocada. Títulos serifados e informações abertas substituem uma grade de pequenos cartões. Espaços reservados, legendas e textos alternativos identificam material pendente. Nenhuma tecnologia ou resultado é atribuído aos projetos sem confirmação. Antes da sequência, uma tela inteira traz apenas “Projetos” em Barlow Condensed. Cada projeto ocupa a altura do viewport e usa `position: sticky`; o próximo painel sobe e cobre o anterior. A faixa vermelha após o terceiro leva a `/projetos`, que informa “Ainda em desenvolvimento”. Em movimento reduzido ou janelas com menos de 691px de altura, os painéis seguem o fluxo normal.

### Service rows and technology groups

Serviços usam campo bordô, divisores horizontais e ações SVG com área de 44px. As tecnologias aparecem agrupadas por função e em texto condensado, sem chips: React/Next.js para interfaces e Java/Spring Boot para backends, conforme conteúdo confirmado. A seleção de um serviço preenche a demanda correspondente no formulário.

### Original film

O filme original `public/Xadrez.mp4` usa pôster local, reprodução sem som e controle de pausa/reprodução no desktop. A preferência por movimento reduzido impede reprodução automática; iniciar pelo controle continua possível no desktop. Até 700px, o vídeo também reproduz e usa `contain` para preservar o quadro inteiro. O pôster aparece durante o carregamento ou quando o vídeo não toca. No desktop largo, o CSS usa `cover`; qualquer mudança de enquadramento exige verificar as duas pessoas e o tabuleiro.

**Regra de movimento.** O filme original pode reproduzir. A única transição de interface aprovada é a sobreposição dos projetos por rolagem nativa, sem controle por JavaScript.

## Do's and Don'ts

### Do:

- **Do** estender Cartaz de autor como direção aprovada, preservando as propostas como variantes históricas.
- **Do** manter contraste tipográfico entre nome em EB Garamond, títulos editoriais e leitura em Manrope.
- **Do** manter foco visível, navegação por teclado e estados de formulário explícitos.
- **Do** preservar as duas pessoas e o tabuleiro do filme nas adaptações de enquadramento.
- **Do** identificar imagens, informações e contatos ilustrativos enquanto o conteúdo real estiver pendente.

### Don't:

- **Don't** adicionar outras animações, parallax ou rolagem controlada por JavaScript à interface.
- **Don't** transformar o comparador histórico em navegação pública.
- **Don't** substituir o filme original por uma imagem gerada de interface.
- **Don't** atribuir tecnologias, resultados ou funcionalidades não confirmados aos projetos.
- **Don't** apresentar contatos ilustrativos como canais ativos ou mostrar sucesso de envio sem confirmação real.

Não canonizado: textos auxiliares de 11–12px são resíduos da implementação, não regras para novas superfícies. O peso 500 solicitado à Barlow Condensed carregada apenas em 600 pertence ao Díptico histórico, não à direção atual. O recorte desktop do filme permanece dependente de verificação visual por proporção; a documentação não transforma esse risco em prescrição de enquadramento.
