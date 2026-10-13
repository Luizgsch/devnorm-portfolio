# Propostas visuais dev_norm

## Como visualizar

Com `npm run dev`, acesse `http://localhost:3000/propostas`.

- `/propostas/cinema`: Cinema editorial. Oferta serifada no espaço superior do filme, nome e ações nas margens inferiores. Fichas de projetos ao lado das imagens.
- `/propostas/diptico`: Díptico rubro. Coluna bordô com tipografia condensada, filme inteiro à direita. Projetos panorâmicos e legendas na base.
- `/propostas/cartaz`: Cartaz de autor. Nome em destaque no alto, oferta na base. Títulos amplos e imagens verticais na galeria.

O seletor permite alternar entre as propostas: fixo na base do desktop e no fluxo, acima do hero, no celular. Usuário escolheu Cartaz de autor. A página principal em `/` implementa essa direção e todas as seções; estas rotas preservam a comparação original.

## Arquivos desta etapa

- `app/propostas/`: comparação, três propostas, componente de vídeo, estilos, conteúdo compartilhado, fichas pendentes e notas de escopo.
- `public/media/`: frame original para poster e celular; três espaços de imagem em SVG.
- `public/fonts/`: Bodoni Moda, Manrope e Barlow Condensed, com licenças OFL.
- `PRODUCT.md`, `DESIGN.md` e `.impeccable/`: contexto, decisões provisórias e evidências de revisão.

A página inicial agora contém o site completo. As alterações locais anteriores foram preservadas. Nenhuma dependência do aplicativo foi adicionada. Embora o briefing cite Tailwind, ele não está instalado neste estado do projeto; as propostas usam CSS escopado sob `.proposal-root` e as fontes locais do Next.js.

## Conteúdo pendente

Usuário confirmou que anexará as imagens depois. Faltam imagens e informações verificáveis de Rango de Rua, AVX e Command Center: contexto, natureza do trabalho, participação, tecnologias e links. Na página principal, contatos fictícios identificados foram autorizados; canais reais e credenciais de envio continuam pendentes. As páginas de projeto identificam cada lacuna. Nas propostas arquivadas, links de sobre, serviços, tecnologias e contato preservam as notas daquela etapa. As seções completas estão na página principal.

## Vídeo

`public/Xadrez.mp4` foi preservado. Tem aproximadamente 10 segundos, 1916 × 1080, 24 fps e marca d’água Kling AI 3.0. As poses do último e primeiro frame diferem; o fechamento do loop original não foi corrigido. O hero usa autoplay silencioso, playsInline, loop, poster e controle de pausa. Celulares recebem frame completo sem baixar o vídeo. Preferência por movimento reduzido mantém o poster; reprodução manual continua disponível no desktop.

## Verificação

- `npm run build` e `npm run lint`.
- Navegação para projetos e abertura das fichas nas três direções.
- Desktop 1440 × 900 e celular 390 × 844, sem overflow horizontal.
- Reprodução silenciosa, controle de pausa e poster para movimento reduzido.
- Zero animações de interface nas verificações do navegador.
- Capturas e relatório em `.impeccable/review/`.

Os espaços de imagem demonstram dimensões e composição; o efeito do fundo desfocado poderá ser avaliado com maior precisão depois de inserir as imagens reais.
