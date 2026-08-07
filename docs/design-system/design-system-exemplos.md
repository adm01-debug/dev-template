# Design Systems de Empresas Famosas — Guia Prático para o ZAPP Web v3

> **Para quem é este documento:** Joaquim (Promo Brindes) e o time do ZAPP Web v3.
> **Objetivo:** entender o que os melhores design systems do mundo fazem, o que podemos copiar
> e como aplicar isso em um app de atendimento omnichannel (tipo WhatsApp Business).
> **Nível:** prático e acionável — sem depender de conhecimento técnico avançado.

---

## Índice

1. [O que é um design system (em linguagem simples)](#1-o-que-é-um-design-system)
2. [Os 8 design systems mais famosos do mundo](#2-os-8-design-systems-mais-famosos-do-mundo)
3. [Padrões visuais comuns entre eles](#3-padrões-visuais-comuns-entre-eles)
4. [O que um app de atendimento/chat precisa em design system](#4-o-que-um-app-de-atendimentochat-precisa-em-design-system)
5. [Checklist de design system maduro (15 itens)](#5-checklist-de-design-system-maduro)
6. [Recomendações específicas para o ZAPP Web v3](#6-recomendações-para-o-zapp-web-v3)
7. [Fontes e referências](#7-fontes-e-referências)

---

## 1. O que é um design system (em linguagem simples)

Um **design system** é o "manual de identidade visual e de comportamento" de um app, mas em formato
que designers E programadores usam juntos. Ele tem 3 camadas:

| Camada | O que é | Exemplo |
|---|---|---|
| **Tokens** | Valores básicos nomeados (cores, tamanhos de fonte, espaçamentos, raios de borda, sombras) | `cor-primaria = #25D366` (verde WhatsApp) |
| **Componentes** | Peças prontas reutilizáveis (botão, campo de busca, avatar, balão de mensagem, badge) | Botão de enviar mensagem |
| **Padrões** | Regras de como combinar componentes em telas | "Lista de conversas: avatar + nome + prévia + horário + badge de não lidas" |

**Por que importa?** Dados da própria Figma mostram que times com design system concluem tarefas
~34% mais rápido. E o efeito prático para o ZAPP: uma tela nova não "inventa" cores, tamanhos e
comportamentos — ela reutiliza o que já foi decidido, o app fica **consistente, mais rápido de
desenvolver e mais profissional** para o cliente final.

---

## 2. Os 8 design systems mais famosos do mundo

### Resumo rápido

| Design System | Empresa | Stack tecnológica | Assinatura visual |
|---|---|---|---|
| **Stripe** (HDS) | Stripe | Web (CSS custom + tokens), React, tipografia própria "Söhne" | Roxo-índigo #533AFD, gradientes, pesos leves (300) |
| **Linear** | Linear | React + Radix UI, Inter Variable (customizada), dark-mode nativo | Quase-preto, um único acento violeta #5E6AD2 |
| **Geist** | Vercel | Design aberto, fonte Geist (open source), React/Next.js | Preto e branco puros, precisão tipográfica |
| **Polaris** | Shopify | React (`@shopify/polaris`), tokens primitivos + semânticos | Azul-índigo, foco em admin/gestão |
| **ADS (Atlassian Design System)** | Atlassian | Pacotes `@atlaskit`, tokens em CSS/JS, temas claro/escuro | Azul B300, acessibilidade como fundação |
| **Carbon** | IBM | Monorepo open source: React, Angular, Vue, Svelte, Web Components | Azul IBM #0f62fe, fonte IBM Plex, grid 2x |
| **Material Design 3** | Google | Android (Compose), Flutter, Web (Material Web), tokens `md.ref.*` | Cor dinâmica (Material You), tons pastel |
| **shadcn/ui** | Comunidade (shadcn) | React + Tailwind CSS + Radix UI — componentes copiados para o SEU código | Sem identidade própria: é um "esqueleto" de sistema |

---

### 2.1 Stripe — "elegância com contenção"

- **Stack:** design tokens em CSS, tipografia própria **Söhne** (peso 300–400), React no front.
- **O que o torna referência:** o dashboard mais admirado do mundo de fintech. Usa MUITA
  contenção: fundo branco/quase-branco, texto azul-marinho profundo (#061B31) e **UM ÚNICO acento
  de cor** — o índigo #533AFD — usado só em botões, links e ícones. Dados densos (tabelas
  financeiras) em moldura generosa.
- **Valores reais que podemos copiar:**
  - Espaçamento em escala de **4px**: `4, 8, 12, 16, 20, 24, 32, 48, 64, 96`.
  - Raios de borda pequenos e consistentes: **4px em botões/inputs**, 6px médio, 8px, 16px em cards.
  - Tipografia com peso 300–400 (leve = ar de sofisticação), letter-spacing negativo em títulos grandes.
  - Cores: 1 cor de marca + neutros frios (branco, azul-escuro, cinza) — nada de arco-íris.

### 2.2 Linear — "precisão de engenharia, dark-mode nativo"

- **Stack:** React + **Radix UI** (primitivas acessíveis), fonte Inter Variable com features
  OpenType (`cv01`, `ss03`), dark mode como padrão nativo (não "modo escuro" — o escuro É o produto).
- **O que o torna referência:** obsessão por acabamento ("qualidade e ofício > velocidade e escala",
  nas palavras do CEO Karri Saarinen). Hierarquia por **luminância**: o fundo é quase preto
  (#08090A) e cada camada sobe um degrau de brilho (#0F1011 → #191A1B) em vez de usar sombras.
- **Valores reais que podemos copiar:**
  - Uma única cor de marca (#5E6AD2 / #7170FF) reservada para ações e estados ativos. Só isso.
  - Bordas finas semi-transparentes (branco com 5–8% de opacidade) em vez de bordas escuras sólidas.
  - Escala de raio: 2px (micro), 4px, **6px (botões/inputs)**, 8px (cards), 12px (painéis), 9999px (pílulas).
  - Peso de fonte "510" (entre regular e medium) como padrão de interface — sutil, não grita.
  - Atalhos de teclado e busca Cmd+K — essencial para ferramentas usadas o dia inteiro.

### 2.3 Vercel Geist — "tipografia como identidade"

- **Stack:** design system aberto da Vercel; fonte **Geist/Geist Mono** (agora open source, no
  Google Fonts); ~29 componentes, 5 fundações. O código dos componentes em si não é 100% aberto —
  a comunidade faz ports (ex.: shadcn/ui é inspirado nele).
- **O que o torna referência:** preto e branco absolutos com precisão tipográfica milimétrica.
  Prova que dá para ter identidade fortíssima sem usar quase nenhuma cor.
- **Valores que podemos copiar:**
  - Neutros puros (preto #000 / branco #FFF) + 1 acento — o mínimo viável de paleta.
  - Monospace (Geist Mono) para dados técnicos: IDs, timestamps, códigos, números de protocolo.
  - Componentes pequenos, densos e "quietos" — o conteúdo é o herói.

### 2.4 Shopify Polaris — "sistema para ecossistema de terceiros"

- **Stack:** React (`polaris-react`), tokens com **duas camadas**: primitivos (escala crua) e
  semânticos (com significado de uso, ex.: `space-card-padding` = espaçamento de card).
- **O que o torna referência:** é o design system do admin da Shopify, usado por milhares de
  apps de terceiros. Provou que um sistema maduro **habilita um ecossistema inteiro** — cada app
  da loja parece parte da mesma família.
- **Valores que podemos copiar:**
  - **Tokens semânticos**: em vez de "azul-500", use "cor-de-sucesso", "espaço-de-card".
    Quando a marca mudar, muda em um lugar só.
  - Regra de bolso: `space-100 = 4px`, `space-400 = 16px` (escala base 4px).
  - Cores por **papel funcional** (sucesso, alerta, erro, neutro) com níveis de contraste
    verificados contra acessibilidade — não cor "bonita" solta.
  - Documentação de uso por componente (quando usar, quando NÃO usar).

### 2.5 Atlassian Design System (ADS) — "acessibilidade como fundação"

- **Stack:** pacotes `@atlaskit` (Jira, Confluence, Trello), design tokens em JS/CSS, temas claro
  e escuro, padrão de nomeação `fundamento.propriedade.modificador` (ex.: `color.text.default`).
- **O que o torna referência:** trata acessibilidade como **qualidade de design**, não checklist:
  os tokens de cor foram recalibrados para contraste WCAG AA nos dois temas. Recentemente virou
  referência em "design system para a era da IA" (servidor MCP + conteúdo estruturado que
  assistentes de IA consomem).
- **Valores que podemos copiar:**
  - Contraste mínimo AA em tudo: texto sobre fundo, badges, estados.
  - Tokens prontos para **dark mode desde o início** (atendente trabalha o dia inteiro no app).
  - Nomear tokens por função: `cor.texto.padrao`, `cor.fundo.elevado`, `borda.raio.card`.
  - Governança: design system tratado como **produto**, com roadmap e feedback loop.

### 2.6 IBM Carbon — "engenharia enterprise open source"

- **Stack:** monorepo open source — `@carbon/react`, Angular, Vue, Svelte, Web Components;
  fonte **IBM Plex**; pacotes de layout, motion, temas, ícones e pictogramas.
- **O que o torna referência:** o sistema mais "engenheirizado" do mercado: suporte
  multi-framework de primeira classe, grid 2x flexível, escala de espaçamento completa e
  **linguagem de movimento com tokens de duração e easing** (produtiva vs. expressiva).
- **Valores que podemos copiar:**
  - Escala de espaçamento completa (em px): **2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 160**.
  - Tokens de movimento: animações curtas e consistentes (ex.: 100–200ms em UI produtiva;
    "entrar/sair" com easing padronizado — nada de animação aleatória).
  - Política explícita de **deprecação**: versão, aviso e caminho de migração para cada mudança.

### 2.7 Google Material Design 3 — "cor dinâmica e tokens acessíveis a todos"

- **Stack:** Android (Jetpack Compose), Flutter, Web (Material Web Components), Figma via
  **Material Theme Builder**; tokens no padrão `md.ref.palette.primary40` / `md.sys.color.*`.
- **O que o torna referência:** popularizou **design tokens** para o mundo inteiro e o conceito
  de **cor dinâmica** (a paleta é gerada a partir do papel de parede do usuário — o sistema
  "veste" a marca do usuário). 60+ componentes, acessibilidade WCAG 2.2.
- **Valores que podemos copiar:**
  - Papéis de cor fixos: primária, secundária, **erro**, superfície, "on-primary" (texto sobre a cor).
  - Forma (raios) e elevação (sombras) como tokens, não valores soltos.
  - Gerar paleta de tema com ferramenta oficial (Theme Builder) em vez de escolher hex na mão.
  - **Não copiar:** a cor dinâmica por wallpaper não faz sentido em app B2B de atendimento —
    consistência de marca vence personalização aqui.

### 2.8 shadcn/ui — "você é dono do código" (o modelo mais moderno)

- **Stack:** React + **Tailwind CSS** + **Radix UI** (primitivas acessíveis). Não é uma biblioteca
  instalada: o CLI (`npx shadcn@latest init` / `add botao`) **copia o código-fonte do componente
  para dentro do seu projeto**. Os tokens ficam em variáveis CSS.
- **O que o torna referência:** o modelo de "copy-paste com propriedade total" virou o padrão
  de mercado em 2024–2026. Você pode alterar qualquer componente sem lutar contra a biblioteca;
  acessibilidade vem de graça via Radix; o visual é 100% seu via tokens.
- **Valores que podemos copiar:**
  - **Propriedade total do código** — nenhuma dependência travando o design do ZAPP.
  - Componentes acessíveis "de fábrica" (Radix cuida de foco, teclado, ARIA).
  - Tema inteiro em variáveis CSS: mudar a marca = mudar variáveis, não componentes.
  - Ideal para o ZAPP: base pronta (botão, input, dropdown, dialog, tooltip) + componentes de
    chat construídos por cima.

---

## 3. Padrões visuais comuns entre eles

Tudo que os grandes sistemas fazem igual — ou seja, o "mínimo obrigatório" para o ZAPP:

### 3.1 Espaçamento em escala (nada de valores soltos)
- **Base de 4px ou 8px** (Stripe 4px, Polaris 4px, Linear 8px, Carbon múltiplos de 2/4/8).
- Escala recomendada: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96`.
- Regra de bolso: **nunca use 5px, 7px, 13px, 17px**... Só valores da escala.

### 3.2 Raios de borda consistentes (poucos valores, com função)
- Padrão que se repete: **2–4px** (micro: badges, tags) · **6–8px** (botões, inputs, cards) ·
  **12–16px** (painéis grandes) · **9999px** (pílulas/chips) · **50%** (avatares, bolinhas de status).
- Regra: raio pequeno = precisão/profissional; raio grande = amigável. Escolha UM e repita.

### 3.3 Cores: marca + neutras + semânticas (nunca arco-íris)
- **1 cor de marca** (Stripe índigo, Linear violeta, Intercom laranja) usada com parcimônia.
- **Neutros**: branco/quase-branco, 3–4 tons de cinza para texto (principal, secundário, apagado),
  bordas suaves.
- **Semânticas** (função, não estética): sucesso (verde), alerta (âmbar), erro (vermelho),
  info (azul) — com variantes de fundo/texto/borda que passam contraste AA.
- Tons de texto em hierarquia (ex.: Linear): `#F7F8F8` (principal) → `#D0D6E0` → `#8A8F98` → `#62666D`.

### 3.4 Tipografia com escala modular
- **2 famílias no máximo** (ex.: Inter + JetBrains Mono/IBM Plex Mono) — uma para texto, uma
  mono para dados técnicos.
- Escala modular (ex.: 12, 13, 14, 15, 16, 18, 20, 24, 32, 40, 48) com **poucos pesos**
  (400 regular, 500/510 médio, 600 semibold — raramente 700+).
- Letter-spacing **negativo** em títulos grandes (Linear: -1.5px a 72px); corpo com
  line-height 1.4–1.6.
- Base de corpo: **16px** (leitura) e 14px (UI densa de atendimento).

### 3.5 Tokens em duas camadas (o "segredo" de todos)
1. **Primitivos** (valores crus): `verde-500 = #25D366`, `espaco-4 = 16px`, `raio-8 = 8px`.
2. **Semânticos** (papel): `cor.marca.primaria`, `cor.texto.padrao`, `espaco.card.padding`,
   `raio.botao`. O código usa SÓ os semânticos — trocar a marca = trocar tokens, não telas.

### 3.6 O que mais se repete
- **Dark mode** desde o início (Atlassian, Linear, Vercel) — tema escuro não é luxo, é produto.
- **Estados de interação** para tudo: hover, foco visível (focus ring), ativo, desabilitado,
  carregando, erro.
- **Elevação por tokens** (sombra nível 1–5) ou por luminância (Linear).
- **Iconografia única** (mesma família de ícones, mesma espessura de traço).
- **Movimento curto e padronizado**: 100–200ms, easing consistente (Carbon/Google).
- **Acessibilidade**: contraste AA, foco visível por teclado, alvos de toque ≥ 40px.

---

## 4. O que um app de atendimento/chat precisa em design system

Um app tipo WhatsApp Business tem **vocabulário próprio**. Estes são os componentes e estados
que o design system do ZAPP deve definir (com exemplos concretos):

### 4.1 Estados de mensagem (o coração do app)
| Estado | Visual típico | Regra de design |
|---|---|---|
| Enviando/pendente | Relógio ou spinner dentro do balão | Deve sumir em <1s normalmente |
| Enviada | ✓ (1 tique) | Cinza, sutil |
| Entregue | ✓✓ (2 tiques) | Cinza |
| Lida | ✓✓ azul | Única cor "extra" permitida na mensagem |
| **Falhou** | ⚠ ícone + texto "Não enviada" | **Obrigatório botão "Tentar novamente"** — sem retry, o atendente perde a confiança no app |
| Digitando | 3 bolinhas animadas | Altura fixa (~28px), **não empurra** o conteúdo — aparece por cima |
| Hora | 12h/24h + separadores de data no meio do thread | Timestamp em texto apagado (3º nível de cinza) |

- **Balões:** mensagem própria vs. recebida com cores diferentes (ex.: verde marca vs. branco),
  largura máx. ~60–70% do painel, raio assimétrico (canto inferior do lado de quem fala mais "pontudo").
- **Lista de conversas:** avatar + nome + prévia + horário + badge de não lidas + ícone do canal
  (WhatsApp, Instagram, Facebook, Telegram, E-mail...).

### 4.2 Badges de status (semânticos, com contraste)
- **Não lidas:** bolinha vermelha com número branco, mín. 16–20px, "99+" acima de 99.
- **Status do contato/atendente:** online (verde), offline (cinza), ausente (âmbar), ocupado.
- **Status do atendimento:** na fila, em andamento, resolvido, fechado, pendente, com SLA estourado (vermelho).
- **Canal:** badge por canal com a cor da plataforma (WhatsApp #25D366, Instagram gradiente, etc.)
  — sempre com fundo neutro e ícone, para não poluir.
- Regra de ouro: **cor semântica nunca é usada "por bonito"** — verde é só sucesso/disponível, vermelho é só erro/urgência.

### 4.3 Avatares
- Escala de tamanhos: **XS 24px (lista densa), S 32px, M 40px, L 56px (painel de conversa), XL 96px (perfil)**.
- Fallback: iniciais do nome sobre fundo colorido derivado do nome (hash).
- Status: bolinha de presença posicionada no canto (borda da cor do fundo para "cortar" o avatar).
- Grupo: avatares empilhados/sobrepostos.

### 4.4 Inputs de busca e filtros
- Busca global **Cmd+K** (paleta de comandos, estilo Linear/Vercel) + busca por conversa no topo da lista.
- Filtros por canal, status, atendente, etiqueta (chips/pílulas com raio 9999px).
- Input com ícone à esquerda, placeholder em cinza apagado, **focus ring visível** (2px, cor de marca, 20–30% opacidade).
- Busca com debounce (~300ms) — não pesquisa a cada tecla.

### 4.5 Painéis (layout 3 colunas)
| Coluna | Conteúdo | Largura típica |
|---|---|---|
| 1. Lista | Conversas + busca + filtros | 280–360px (redimensionável) |
| 2. Conversa | Thread + composer | Flexível (a maior) |
| 3. Detalhes | Contato, histórico, etiquetas, atalhos | 260–320px (colapsável) |

- Painéis com fundo levemente diferente do canvas (1 degrau de luminância), borda divisória de 1px.
- **Densidade compacta** como opção: atendente quer MUITAS conversas na tela (estilo Linear, não marketing).

### 4.6 Outros componentes obrigatórios
- **Composer:** expande verticalmente, botões de anexo/mídia/emoji, botão enviar desabilitado quando vazio.
- **Respostas rápidas / atalhos** (canned responses) com autocomplete.
- **Estados vazios** (nenhuma conversa, busca sem resultado) — com ilustração + texto + ação.
- **Skeletons de carregamento** (esqueleto cinza pulsando) para o histórico de mensagens.
- **Mensagens de sistema** no thread (centralizadas, texto apagado): "Conversa transferida para Fulano".
- **Lista virtualizada** (renderiza só o que aparece na tela) — conversas com 10k mensagens não travam.
- **Notificações/toasts** (mensagem nova, erro de envio, desconexão) — canto, auto-dismiss, com ação quando erro.

---

## 5. Checklist de design system maduro

Use para auditar o ZAPP (marque ✅ / ⬜). Design system maduro = 12+ itens:

1. **Tokens de cor** — primitivos + semânticos (marca, neutros, sucesso/alerta/erro/info) definidos em UM lugar (ex.: variáveis CSS).
2. **Tokens de espaçamento** — escala base 4px (4/8/12/16/20/24/32/40/48/64) e ninguém usa valor fora da escala.
3. **Tokens de tipografia** — escala modular (12–48px), ≤3 pesos, 2 famílias (texto + mono), line-heights fixos.
4. **Tokens de raio** — escala curta (2/4/6/8/12/16/pílula/círculo) com regra de uso por tipo de elemento.
5. **Tokens de elevação/sombra** — 4–5 níveis nomeados (subtle → dialog) — ou luminância no dark.
6. **Tokens de movimento** — durações (100–200ms) e easing padronizados; sem animação arbitrária.
7. **Dark mode** — mesmo conjunto de tokens gera tema claro e escuro (testado com contraste AA nos dois).
8. **Estados de interação** — todo componente tem hover, foco visível, ativo, desabilitado, carregando, erro.
9. **Estados de conteúdo** — vazio, carregando (skeleton), erro com ação de recuperação, "sem permissão".
10. **Componentes de chat** — estados de mensagem (enviada/entregue/lida/falhou+retry), digitando, badges, avatares, composer — documentados.
11. **Acessibilidade AA** — contraste verificado, navegação por teclado, foco visível, alvos ≥ 40px, labels para leitores de tela.
12. **Iconografia única** — mesma família/espessura de ícones em todo o app.
13. **Documentação viva** — página de cada componente com: quando usar, quando NÃO usar, exemplo de código, acessibilidade.
14. **Versionamento e deprecação** — mudanças têm versão e changelog; componente antigo tem aviso e caminho de migração.
15. **Governança** — alguém (ou um time pequeno) é dono do sistema, decide mudanças e revisa PRs de UI.

---

## 6. Recomendações para o ZAPP Web v3

### 6.1 Stack recomendada
- **React + TypeScript + Tailwind CSS + shadcn/ui (Radix UI)** — o padrão de mercado atual, alinhado
  com o modelo "você é dono do código": componentes copiados para o repo do ZAPP, tema inteiro em
  variáveis CSS, acessibilidade de graça via Radix. Nenhuma dependência trava o design.
- Fonte: **Inter** (texto) + **JetBrains Mono** ou Geist Mono (dados técnicos: IDs, timestamps, protocolos).
  Alternativa com mais identidade: fonte própria no futuro.

### 6.2 Tokens iniciais sugeridos (para o time implementar)
- **Base:** espaçamento 4px; raio 6px (botões/inputs), 8px (cards), 12px (painéis), 9999px (badges).
- **Cores de marca:** verde de atendimento (herança WhatsApp Business) como primária + neutros
  quentes ou frios (escolher UM e manter) + semânticas (sucesso/alerta/erro/info) com contraste AA.
- **Tokens semânticos primeiro:** `cor.marca`, `cor.texto.padrao`, `cor.texto.apagado`,
  `cor.fundo.painel`, `cor.borda`, `raio.botao`, `espaco.painel` — o código usa só esses.

### 6.3 Prioridades de componentes de chat (fase 1)
1. Estados de mensagem com **falha + retry** (não-negociável para atendimento).
2. Badges de não lidas e de status de atendimento com contraste AA (vermelho + branco).
3. Avatares com fallback de iniciais + bolinha de presença.
4. Busca Cmd+K + filtros por canal/status.
5. Layout 3 colunas com painéis colapsáveis e densidade compacta.
6. Typing indicator com altura fixa (não empurra o conteúdo).
7. Dark mode desde o início (atendente usa o app o dia inteiro).

### 6.4 Regras de ouro para o ZAPP
- **1 cor de marca + neutros + semânticas.** Se uma tela tem mais de 4 cores "decorativas", está errada.
- **Nunca valores soltos:** sem `padding: 13px` ou `#123456` espalhados no código — sempre tokens.
- **Acessibilidade não é opcional:** contraste AA em badges e textos; foco visível para quem usa teclado.
- **Consistência > criatividade:** o cliente que usa o ZAPP precisa reconhecer o app em qualquer tela nova.
- **Documente em português:** uma página simples por componente ("quando usar", "quando não usar",
  exemplo) já coloca o ZAPP acima de 90% dos apps do mercado.
- **Meça com o checklist da seção 5** a cada release: maduro = 12+ itens ✅.

---

## 7. Fontes e referências

- Stripe design tokens/typography: design-extractor.com/gallery/stripe · designmd.cc/benchmarks/stripe · open-design.ai
- Linear: review.firstround.com (Path to PMF) · template de tokens (skill popular-web-designs, Hermes)
- Vercel Geist: github.com/vercel/vercel (discussion #6094) · geist.vercel.sh · designsystems.surf/design-systems/vercel
- Shopify Polaris: polaris.shopify.com (tokens de cor, tipografia, layout, sombra) · ecorn.agency/blog/polaris-design-system
- Atlassian Design System: atlassian.design (foundations, design tokens) · atlassian.com/blog/design (acessibilidade)
- IBM Carbon: carbondesignsystem.com (espaçamento, grid, tipo) · github.com/carbon-design-system/carbon
- Google Material 3: m3.material.io (design tokens) · developer.android.com (Compose M3)
- shadcn/ui: ui.shadcn.com · infinum.com/handbook/frontend/react/tailwind/shadcn · shadcncraft.com
- Chat/atendimento: cometchat.com/blog/chat-app-design-best-practices · medium.com/design-bootcamp (anatomia do chat do WhatsApp) · telerik.com KendoReact (estados de mensagem falhada)
- Tokens em geral: styleframe.dev · maindigital.com · penpot.app (guia de tokens/CSS variables)

---

*Documento gerado em pesquisa na web (ago/2026) com base nos sistemas públicos dos respectivos sites e documentações. Valores de tokens são exemplos reais extraídos dos sistemas; use como referência de implementação, não como especificação oficial.*
