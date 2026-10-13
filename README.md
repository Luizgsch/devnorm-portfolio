# dev_norm — portfólio de Luiz Schreiner

Site em Next.js 16, React e TypeScript. A direção **Cartaz de autor**, terceira proposta aprovada, orienta a página principal: filme de xadrez, tipografia editorial, preto vinho, marfim e bordô.

## Executar

```sh
npm install
npm run dev
```

Abra `http://localhost:3000`. Para produção local:

```sh
npm run build
npm run start
```

## Páginas e conteúdo

- `/`: apresentação, sobre, três projetos, serviços, tecnologias e contato.
- `/projetos`: página de todos os projetos, marcada como ainda em desenvolvimento.
- `/projetos/rango-de-rua`, `/projetos/avx`, `/projetos/command-center`: fichas com lacunas explicitamente identificadas.
- `/privacidade`: informações sobre o formulário.
- `/propostas`: arquivo das três propostas originais.

Edite os projetos, serviços e tecnologias em `lib/portfolio.ts`. Foram confirmados somente **Java/Spring Boot** e **React/Next.js**. A associação dessas tecnologias a cada projeto depende de confirmação.

As imagens atuais são espaços reservados autorizados pelo usuário. Para inserir uma imagem, salve o arquivo em `public/media/`, atualize `image` e defina `imagePending: false`. Preencha `nature`, `context`, `development` e `technologies` somente com informações verificadas. As fichas com contexto ausente usam `noindex`.

Estilos da página principal e das fichas: `app/site.module.css`. Fontes locais e licenças: `public/fonts/`. O hero usa EB Garamond para “Luiz Schreiner”; as demais fontes seguem nos títulos, navegação e corpo. Nenhuma dependência de animação foi adicionada.

## Contatos e formulário

Nesta prévia, e-mail e WhatsApp são **fictícios, identificados e sem links ativos**. Sem credenciais, o botão de envio fica indisponível. A pessoa pode validar e copiar sua mensagem; copiar não envia.

Copie `.env.example` para `.env.local` e preencha os valores reais quando estiverem disponíveis:

| Variável | Uso |
| --- | --- |
| `RESEND_API_KEY` | Chave privada do serviço de envio |
| `CONTACT_FROM_EMAIL` | Remetente em domínio verificado no Resend |
| `CONTACT_TO_EMAIL` | Destinatário das mensagens |
| `SITE_CONTACT_EMAIL` | E-mail público opcional |
| `SITE_WHATSAPP` | Número público com código do país e DDD |
| `SITE_GITHUB_URL` | URL pública HTTPS opcional |
| `SITE_LINKEDIN_URL` | URL pública HTTPS opcional |

Reinicie o servidor depois de alterar o ambiente. A chave fica exclusivamente no servidor; não use prefixo `NEXT_PUBLIC_`. O preenchimento das três variáveis de envio habilita o formulário; credenciais inválidas continuam produzindo erro real.

`POST /api/contact` valida os campos, limita o corpo a 24.000 bytes e chama a [API oficial do Resend](https://resend.com/docs/api-reference/emails/send-email). Só retorna sucesso após resposta positiva com identificador da mensagem. Isso confirma o aceite pelo provedor, não a entrega ou leitura. O texto é preservado em falhas; tentativas repetidas do mesmo conteúdo usam uma chave de idempotência.

A proteção local permite cinco tentativas por IP em 15 minutos, por processo. Ela reinicia com o servidor e não é compartilhada entre instâncias. Antes de habilitar envio em hospedagem pública, configure limitação compartilhada na hospedagem e confirme que o proxy sobrescreve `x-forwarded-for`. O formulário também usa honeypot e verifica a origem quando o navegador informa esse cabeçalho.

## Vídeo e acessibilidade

`public/Xadrez.mp4` permanece original. Desktop permite reprodução silenciosa e pausa; o controle fica no alto da abertura. Celular reproduz o mesmo vídeo, sem som e com enquadramento completo; o pôster aparece durante o carregamento ou quando há preferência por movimento reduzido. O hero móvel usa o vermelho `#4E0007` e o degradê para Sobre começa abaixo da primeira viewport. Os três projetos ficam fixos enquanto o painel seguinte sobe por cima na rolagem. O efeito usa `position: sticky`, sem controle de rolagem por JavaScript; é desativado para movimento reduzido e janelas com menos de 691px de altura. O loop e a marca d’água pertencem ao arquivo original.

Campos têm rótulos, estados acessíveis, indicação de erros e foco. A navegação usa âncoras nativas. O layout foi verificado em 320, 390, 768 e 1440 pixels.

## Verificação

```sh
npm run lint
npm run test:contact
npm run build
```

Os oito testes do contato cobrem validação, ausência de configuração, aceite do provedor, falhas, idempotência, WhatsApp, formato/origem/tamanho e limite de tentativas. Usam transporte simulado e não enviam e-mails.

Evidências de navegador em `.impeccable/review/site/` e `.impeccable/review/project-stack/`: capturas, navegação, sobreposição dos painéis, ausência de overflow, cópia e estados do formulário. Os scripts de captura em `.impeccable/` usam Playwright instalado na ferramenta local de QA, fora das dependências do aplicativo; não fazem parte dos comandos de teste reproduzíveis acima.

## Pendências de conteúdo

- Imagens e informações reais dos três projetos.
- Canais públicos reais e credenciais de envio.
- Teste de entrega com o destinatário real após configurar o serviço.

Decisões visuais em `DESIGN.md`; contexto em `PRODUCT.md`; histórico de propostas em `PROPOSTAS.md`.
