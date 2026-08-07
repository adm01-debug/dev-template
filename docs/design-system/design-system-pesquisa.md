# Design System — Fundamentos e Boas Práticas

> **Documento de pesquisa** para a Promo Brindes · Aplicável ao ZAPP Web v3 (atendimento omnichannel estilo WhatsApp Business)
> Complementa o documento `design-system-ferramentas.md` (ferramentas). Este documento cobre **os fundamentos**: o que é, tokens, Atomic Design, componentes, tipografia, cores e estrutura de pastas.

---

## Sumário

1. [O que é um Design System e por que usar](#1-o-que-é-um-design-system-e-por-que-usar)
2. [Design Tokens: a fundação visual](#2-design-tokens-a-fundação-visual)
3. [Atomic Design: dos átomos às páginas](#3-atomic-design-dos-átomos-às-páginas)
4. [Componentes core e seus estados](#4-componentes-core-e-seus-estados)
5. [Tipografia: escala, hierarquia e line-height](#5-tipografia-escala-hierarquia-e-line-height)
6. [Cores: paleta, contraste WCAG e dark mode](#6-cores-paleta-contraste-wcag-e-dark-mode)
7. [Estrutura de pastas recomendada (React + TypeScript)](#7-estrutura-de-pastas-recomendada-react--typescript)

---

## 1. O que é um Design System e por que usar

### 1.1 Definição

> **Design system** é um conjunto completo de padrões destinado a gerenciar o design em escala, usando componentes e padrões reutilizáveis.
> — Nielsen Norman Group (NN/g), *Design Systems 101*

Na prática, um design system é **a "fonte única da verdade"** do visual de um produto: uma biblioteca de peças prontas (botões, campos, cartões, janelas) + as regras de como usá-las (cores, fontes, espaçamentos) + a documentação explicando tudo.

Um design system tem 3 partes (NN/g):

| Parte | O que é | Exemplo no ZAPP Web v3 |
|---|---|---|
| **Style guide** | Regras de estilo: cores, tipografia, tom de voz | Paleta da marca, fontes dos chats |
| **Component library** | Peças de UI prontas e reutilizáveis | Botão "Responder", campo de busca de conversas |
| **Pattern library** | Padrões de uso combinado das peças | Tela de conversa: header + lista de mensagens + caixa de texto |

### 1.2 Benefícios (em linguagem de negócio)

Para o dono da empresa (não-dev), o design system vale pelo seguinte:

- **Consistência visual** — Todo o app parece feito pela mesma equipe, na mesma marca. Sem design system, cada tela inventa sua própria cor de botão e o app parece "remendado". Um case famoso (Toptal): antes do design system, um site tinha **184 cores diferentes** — depois, uma paleta enxuta.
- **Velocidade de entrega** — Designers da Figma completam tarefas **34% mais rápido** com um sistema (dado da Figma). No código, o dev não recria o botão toda vez: ele puxa a peça pronta. Funcionalidade nova = montar com peças existentes, não inventar do zero.
- **Manutenção barata** — Mudar a cor da marca (ex.: novo tom de verde do WhatsApp) vira **uma mudança em um único lugar**, e o app inteiro atualiza. Sem sistema, seria dezenas de horas caçando cores soltas em cada tela.
- **Linguagem comum** — Quando o dev fala "botão primário", todo mundo sabe exatamente qual é. Acabam-se os mal-entendidos entre design, dev e dono.
- **Onboarding rápido** — Pessoas novas (dev, designer, conteúdo) aprendem o padrão lendo a documentação, em vez de perguntar ou adivinhar.

### 1.3 Quando (não) usar

- **Use** quando o produto tem várias telas, equipe crescente, ou precisa de rebranding periódico (caso do ZAPP: app + futuras landing pages + materiais).
- **Não use** para protótipo descartável ou produto de uma tela só — o custo inicial não compensa.

### 1.4 Regra de ouro para começar

> Comece pequeno: **tokens de cor/espaçamento/tipografia + 5 a 10 componentes core** (botão, input, card, badge, avatar, modal, toast). Expanda conforme os padrões aparecem. Não crie 300 tokens no primeiro dia.

---

## 2. Design Tokens: a fundação visual

### 2.1 O que são

**Design tokens** são os "átomos visuais" nomeados: valores de cor, tipografia, espaçamento, raio, sombra, etc., guardados com um nome que **descreve o propósito** em vez do valor cru.

Em vez de escrever `#3b82f6` (um azul qualquer) em 40 lugares, você escreve `color.brand.primary.500` em um lugar só e o resto do sistema **referencia esse nome**.

```
// Ruim — valor cru espalhado pelo código
botao1: fundo #3b82f6
botao2: fundo #3b82f6
input: borda #3b82f6

// Bom — token único, referenciado
color.brand.primary.500 = #3b82f6
botao1: fundo = color.brand.primary.500
botao2: fundo = color.brand.primary.500
input: borda = color.brand.primary.500
```

### 2.2 Como nomear tokens (o formato `color.brand.primary.500`)

A convenção mais usada é **hierárquica, do geral para o específico**, separada por pontos:

```
categoria . propriedade . variante . estado
color      . text       . primary  . hover
```

| Parte | O que define | Exemplos |
|---|---|---|
| **Categoria** | Tipo de token | `color`, `space`, `font`, `radius`, `shadow` |
| **Propriedade** | O que ele controla | `text`, `background`, `border`, `size`, `weight` |
| **Variante** | Qual variação | `primary`, `secondary`, `brand`, `success`, `error`, `sm`, `md` |
| **Escala/Estado** | Nível da escala ou estado | `500`, `hover`, `disabled`, `focus` |

**Exemplos de nomes corretos:**

```
color.brand.primary.500      → azul principal da marca, tom 500
color.text.primary           → cor do texto principal
color.border.error           → cor da borda de erro
space.4                      → espaçamento nível 4 (16px na escala de 4px)
font.size.body               → tamanho de fonte do corpo do texto
font.weight.bold             → peso de fonte negrito
radius.md                    → raio de canto médio
shadow.md                    → sombra média (elevação)
```

**Nomes proibidos** (erros clássicos):

| Errado | Por quê |
|---|---|
| `--blue` | Qual azul? Ambíguo |
| `--color1` | Sem significado |
| `--big-spacing` | Impreciso ("grande" para quem?) |
| `--the-blue-on-homepage` | Específico demais; não reutilizável |

**Regras de ouro da nomeação:**
1. Comece pela categoria (agrupa e organiza).
2. Use **nome de propósito** (semântico), não nome literal: `color.brand.primary` e não `color.blue-500` quando o uso for de marca.
3. Inclua variantes e estados quando fizer sentido (`primary`, `hover`, `disabled`).
4. kebab-case no CSS (`--color-text-primary`), camelCase no JS (`colorTextPrimary`).

### 2.3 A hierarquia em 3 níveis (primitivo → semântico → componente)

O segredo para um sistema que **sobrevive a rebranding e dark mode** é separar em 3 camadas:

```
Nível 1 — Primitivos (valores crus, sem contexto)
  gray.100 = #f3f4f6   gray.900 = #111827   space.4 = 16px

Nível 2 — Semânticos (significado; referenciam primitivos)
  color.background = gray.100
  color.text.primary = gray.900

Nível 3 — Componente (uso específico; referenciam semânticos)
  button.background = color.brand.primary.500
  button.padding = space.3 space.4
```

**Por que 3 níveis?** Se amanhã a marca mudar de azul para verde, você muda **apenas o nível 1** (o valor de `brand.primary.500`). Se o app ganhar dark mode, você troca **apenas o nível 2** (os semânticos apontam para primitivos escuros). Os componentes nem precisam ser tocados.

### 2.4 Escala de espaçamento (base 4px)

O padrão da indústria é uma escala numérica múltipla de 4px (também comum: 8px). Tudo — padding, margens, gaps, alturas — vem dessa escala. **Nunca invente um espaçamento fora da escala.**

| Token | Valor | Uso típico |
|---|---|---|
| `space.0` | 0 | — |
| `space.1` | 4px | Gap mínimo entre ícone e texto |
| `space.2` | 8px | Padding interno de botão pequeno |
| `space.3` | 12px | Padding interno de botão padrão |
| `space.4` | 16px | Padding de card, gap entre blocos |
| `space.6` | 24px | Espaço entre seções de uma tela |
| `space.8` | 32px | Espaço entre cards de conversa |
| `space.12` | 48px | Respiração de páginas/headers |
| `space.16` | 64px | Seções grandes (topo de página) |

> **Por que 4px?** Todos os números dividem por 4 → alinhamento perfeito em qualquer resolução, ritmo visual consistente, e é o múltiplo comum usado por Material Design, Tailwind e quase todos os grandes sistemas.

### 2.5 Raios e sombras

- **Radius (raio de canto):** escala curta — `radius.none` (0), `radius.sm` (4px), `radius.md` (8px), `radius.lg` (12px), `radius.full` (999px = pílula para badges/avatares).
- **Sombras (elevação):** escala curta — `shadow.none`, `shadow.sm`, `shadow.md`, `shadow.lg`. Regra prática: sombra = profundidade; quanto mais "flutuante" o elemento (modal, dropdown), maior a sombra.

### 2.6 Tokens em código — como ficam na prática

```css
/* tokens.css — exemplo real (nível 1 + 2) */
:root {
  /* Primitivos */
  --blue-500: #3b82f6;
  --blue-600: #2563eb;
  --gray-50: #f9fafb;
  --gray-900: #111827;
  --space-4: 1rem;   /* 16px */

  /* Semânticos */
  --color-primary: var(--blue-500);
  --color-primary-hover: var(--blue-600);
  --color-background: var(--gray-50);
  --color-text: var(--gray-900);
  --spacing-card: var(--space-4);
}

/* Uso no componente */
.card {
  background: var(--color-background);
  color: var(--color-text);
  padding: var(--spacing-card);
  border-radius: 8px;
}
```

**Ferramenta padrão da indústria:** o **Style Dictionary** (da Amazon) lê tokens em JSON e gera automaticamente CSS, Swift, Android XML, etc. — um token, todas as plataformas. (Detalhes de ferramentas no documento `design-system-ferramentas.md`.)

---

## 3. Atomic Design: dos átomos às páginas

Metodologia criada por **Brad Frost** (2013) que organiza a interface em 5 níveis hierárquicos, inspirada na química: átomos se combinam em moléculas, que formam organismos, montados em templates, preenchidos em páginas.

> Atomic Design **não é processo linear** — é um modelo mental para enxergar a interface como um todo e como peças ao mesmo tempo.

### 3.1 Os 5 níveis

| Nível | Definição | Exemplos genéricos | Exemplos no ZAPP Web v3 |
|---|---|---|---|
| **1. Átomos** | Elementos básicos que não podem ser quebrados sem perder função | Botão, input, label, ícone, avatar, título, cor, fonte | Input de mensagem, botão enviar, avatar do contato, ícone de anexo |
| **2. Moléculas** | Grupos simples de átomos com função própria | Label + input + botão = formulário de busca | Campo de busca + ícone de lupa; chip de status + nome do contato |
| **3. Organismos** | Seções complexas formadas por moléculas/átomos | Header do site (logo + nav + busca) | Card de conversa completo (avatar + nome + última msg + hora + badge não-lido); barra lateral de chats; janela de conversa |
| **4. Templates** | Esqueleto da página: onde cada organismo fica, sem conteúdo real | Layout da homepage (header + hero + footer) | Layout "3 colunas": sidebar de chats + janela de conversa + painel de detalhes do contato |
| **5. Páginas** | Template preenchido com conteúdo real | Homepage com textos e imagens reais | Conversa real com o cliente "Maria", 3 mensagens não lidas, anexo de PDF |

### 3.2 Exemplo concreto: a janela de conversa do ZAPP

```
PÁGINA: Conversa com cliente
└── TEMPLATE: Layout 3 colunas (chats | conversa | detalhes)
    └── ORGANISMO: Janela de conversa
        ├── MOLÉCULA: Header da conversa
        │   ├── ÁTOMO: Avatar (foto do contato)
        │   ├── ÁTOMO: Nome do contato
        │   └── ÁTOMO: Badge de status (online/offline)
        ├── MOLÉCULA: Bolha de mensagem recebida
        │   ├── ÁTOMO: Texto
        │   └── ÁTOMO: Timestamp
        └── MOLÉCULA: Barra de digitação
            ├── ÁTOMO: Input de texto
            ├── ÁTOMO: Botão de anexo
            └── ÁTOMO: Botão enviar
```

**Por que isso importa para o negócio:** a mesma "bolha de mensagem" (molécula) é usada no WhatsApp, no Instagram e no Facebook Messenger do ZAPP — construída **uma vez**, consistente em todos os canais. Se o dono pedir "arredonda mais as bolhas", a mudança é feita **num lugar só** e os 3 canais atualizam juntos.

### 3.3 Vantagens práticas

- **Parte e todo ao mesmo tempo:** dá para ver o sistema quebrado em peças E montado em telas reais.
- **Single responsibility:** cada peça faz uma coisa e faz bem → mais fácil testar e reutilizar.
- **Templates testam a estrutura antes do conteúdo:** o layout "aguenta" título curto e título longo sem quebrar.
- **Páginas revelam problemas:** se o texto real não cabe na bolha, você corrige a molécula, não a página.

---

## 4. Componentes core e seus estados

### 4.1 Componentes essenciais de qualquer sistema

| Componente | Função | Uso no ZAPP Web v3 |
|---|---|---|
| **Botão (Button)** | Dispara ação | Enviar mensagem, salvar contato, abrir chat |
| **Campo de texto (Input)** | Entrada de dados | Buscar conversa, digitar mensagem, editar nome |
| **Card** | Agrupa conteúdo | Card de conversa, card de contato, card de produto |
| **Modal** | Diálogo sobre a tela | Confirmar exclusão de conversa, editar contato |
| **Badge** | Contador/status pequeno | "3" mensagens não lidas, status "online", tag "novo" |
| **Avatar** | Foto/perfil do usuário | Foto do contato, foto do atendente |
| **Toast** | Notificação rápida e temporária | "Mensagem enviada", "Contato salvo com sucesso" |
| **Dropdown/Select** | Escolher entre opções | Selecionar canal (WhatsApp/Instagram), status do atendimento |
| **Tooltip** | Dica ao passar o mouse | Explicar ícone de anexo |
| **Tabs** | Navegar entre seções | Abas "Conversas / Contatos / Configurações" |
| **Checkbox/Radio** | Seleção múltipla/única | Filtros de busca, preferências |
| **Skeleton** | Placeholder de carregamento | Esqueleto da lista de conversas enquanto carrega |

### 4.2 Estados de interação (o que todo componente precisa)

Cada componente interativo deve ter **estados definidos** — o NN/g lista 5 estados core (mais os funcionais):

| Estado | Quando aparece | O que muda visualmente | Exemplo (botão) |
|---|---|---|---|
| **Default** | Estado normal, pronto para uso | Aparência base | Botão azul preenchido |
| **Hover** | Mouse em cima (só mouse) | Escurece/clareia levemente | Azul mais escuro |
| **Active/Pressed** | Mouse pressionado | Leve "afundamento" / tom mais forte | Azul mais escuro ainda + sombra reduzida |
| **Focus** | Navegação por teclado/tab | Anel de foco visível (outline) | Contorno azul claro ao redor |
| **Disabled** | Ação indisponível | Opacidade reduzida (40-50%), cursor bloqueado | Botão cinza apagado |
| **Loading** | Ação em andamento | Spinner no lugar do texto, clique bloqueado | "Enviando…" com círculo girando |
| **Error** | Validação falhou | Borda/ícone vermelho + mensagem | Campo com borda vermelha + "Número inválido" |
| **Success** | Ação concluída | Confirmação verde | Toast verde "Mensagem enviada" |

**Regras de ouro dos estados:**
1. **Hover é opcional, Focus é obrigatório** — foco visível é requisito de acessibilidade (navegação por teclado precisa saber onde está).
2. **Hover, Active e Disabled sempre com contraste adequado** — o estado não pode "sumir" na tela.
3. Transições curtas: **~150ms** (rápido o bastante para parecer responsivo, lento o bastante para não distrair).
4. **Nunca usar só cor para indicar estado** — erro = borda vermelha **+ ícone + texto** (usuários daltônicos dependem disso).

```css
/* Exemplo de estados em CSS */
.button {
  background: var(--color-primary);
}
.button:hover {
  background: var(--color-primary-hover);
}
.button:active {
  background: var(--color-primary-active); /* mais escuro */
  transform: translateY(1px);
}
.button:focus-visible {
  outline: 3px solid var(--color-focus-ring); /* anel de foco */
  outline-offset: 2px;
}
.button:disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-400);
  cursor: not-allowed;
  opacity: 0.5;
}
```

---

## 5. Tipografia: escala, hierarquia e line-height

> Tipografia é **85–90% de qualquer tela** (designsystems.com). É o primeiro fundamento a acertar.

### 5.1 Escala modular

A **escala modular** é uma sequência de tamanhos gerada por uma **proporção fixa** a partir de um tamanho base (normalmente 16px = corpo de texto). Proporções comuns: **1.250 (maior terça)**, **1.333 (quarta perfeita)**, **1.618 (proporção áurea)**.

- Quanto maior a proporção, maior o contraste entre título e texto (bom para landing pages).
- Apps/dashboards (caso do ZAPP) usam proporções menores — hierarquia discreta.

**Escala recomendada para o ZAPP (base 16px, ajustada ao grid de 4px):**

| Token | Tamanho | Line-height | Uso |
|---|---|---|---|
| `font.size.xs` | 12px | 16px (1.33) | Legendas, timestamps ("10:42") |
| `font.size.sm` | 14px | 20px (1.43) | Texto auxiliar, labels de formulário |
| `font.size.base` | **16px** | **24px (1.5)** | **Corpo de texto — a base** |
| `font.size.lg` | 18px | 28px (1.55) | Texto destacado, subtítulos |
| `font.size.xl` | 20px | 28px (1.4) | Título de card, nome de contato |
| `font.size.2xl` | 24px | 32px (1.33) | Título de seção (H3) |
| `font.size.3xl` | 32px | 40px (1.25) | Título de página (H2) |
| `font.size.4xl` | 40px | 48px (1.2) | Título principal (H1) |

**Regras:**
- Comece pela escala modular como guia e **arredonde os valores para múltiplos de 4px** (25px → 24px) para alinhar com o grid.
- Use `rem` (relativo à raiz) em vez de `px` — respeita o zoom/ajuste de fonte do usuário (acessibilidade).
- **Nunca use tamanhos fora da escala.** Se precisar de um tamanho novo, adicione-o à escala — não invente no componente.

### 5.2 Hierarquia

Hierarquia = **ordem visual de importância**, criada com tamanho + peso + cor:

```
H1 — 40px / Bold          → "Painel de Atendimento" (só 1 por página)
H2 — 32px / Bold          → "Conversas"
H3 — 24px / Semibold      → "Contato: Maria Silva"
Corpo — 16px / Regular    → mensagens, textos
Caption — 12px / Regular  → timestamps, contadores
```

Regras:
- **1 H1 por página**; títulos em hierarquia estrita (não pule de H1 para H3).
- Prefira **aumentar tamanho** a adicionar pesos de fonte (menos pesos carregados = site mais rápido).
- Limite de pesos: **Regular (400), Medium (500), Semibold (600), Bold (700)** — raramente precisa de mais.

### 5.3 Line-height (entrelinha)

- Regra geral de partida: **line-height = 1.5 × tamanho da fonte** (designsystems.com).
- Títulos (grandes): line-height mais **justo** (1.2–1.3) — espaço morto em volta de títulos grandes parece erro.
- Texto corrido (pequeno): line-height mais **folgado** (1.5–1.75) — legibilidade.
- Use line-height como base para o **baseline grid** (grade de 4px): todas as entrelinhas devem dividir por 4 → tipografia e espaçamento se alinham perfeitamente.

```css
:root {
  --line-height-tight: 1.25;   /* títulos */
  --line-height-normal: 1.5;   /* corpo */
  --line-height-relaxed: 1.75; /* textos longos */
}
```

### 5.4 Famílias de fonte

- Máximo **2 famílias** por sistema (ex.: uma para UI/texto + uma para destaque/marca).
- Prefira **fontes de sistema** (`system-ui, -apple-system, Segoe UI, Roboto...`) para performance — é o que Shopify Polaris faz. Carregar fonte web = tempo de carregamento maior.
- Reserve fontes de marca (muito estilizadas) para **display** (títulos grandes), nunca para texto pequeno (ilegível).

---

## 6. Cores: paleta, contraste WCAG e dark mode

### 6.1 Estrutura da paleta

```
PALETA (nível primitivo — escala de 50 a 900 por cor)
├── brand (azul da marca)   → brand.50 … brand.500 … brand.900
├── neutral (cinzas)        → neutral.50 … neutral.900
├── success (verde)         → success.500
├── warning (amarelo)       → warning.500
├── error (vermelho)        → error.500
└── info (azul info)        → info.500

USOS (nível semântico)
├── color.background, color.surface, color.border
├── color.text.primary / .secondary / .tertiary
├── color.brand.primary / .hover / .active
└── color.success / .warning / .error / .info
```

- Escala de **10 tons (50–900)** por cor dá flexibilidade total (hover = tom adjacente, fundos suaves = tons 50–100).
- Tons **nunca usados diretamente** em componentes — sempre via semânticos (senão, dark mode e rebranding quebram).

### 6.2 Contraste WCAG AA (não negociável)

O **WCAG 2.1, nível AA** define os mínimos (obrigatórios em sistemas sérios e em apps públicos):

| Elemento | Contraste mínimo | Cálculo |
|---|---|---|
| Texto normal (< 18pt) | **4.5 : 1** | luminância do texto vs. fundo |
| Texto grande (≥ 18pt ou ≥ 14pt bold) | **3 : 1** | idem |
| Componentes de UI (bordas de input, ícones essenciais) | **3 : 1** | vs. cores adjacentes |
| Indicador de foco | **3 : 1** | vs. cor adjacente |

**Regras práticas:**
- Texto **nunca** em cinza claro sobre branco (o clássico "cinza #999 em branco" reprova com folga — use no mínimo `neutral.600`).
- **Não confie no olho:** contraste se mede com ferramentas (WebAIM Contrast Checker, Stark no Figma, Chrome DevTools).
- Teste os **pares reais** do sistema (texto sobre botão, texto sobre card), não só a paleta isolada.
- Não use **cor sozinha** para transmitir informação: erro = vermelho + ícone + texto.

### 6.3 Dark mode

**Como fazer certo (sem duplicar o sistema):** tudo via tokens semânticos — o dark mode troca **só o nível 2**:

```css
/* Tema claro (padrão) */
:root {
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-text: #111827;
  --color-border: #e5e7eb;
}

/* Tema escuro — mesmos nomes, valores diferentes */
:root[data-theme="dark"] {
  --color-background: #111827;
  --color-surface: #1f2937;
  --color-text: #f9fafb;
  --color-border: #374151;
}

/* O componente não muda NADA */
.card {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
```

**Pitfalls do dark mode (WCAG):**
- **Não use preto puro** (#000) — use cinza bem escuro (#121212 ou tons 800–900). Preto puro + branco = ofuscamento (halation) em telas OLED.
- **Cores saturadas brilham demais no escuro** — reduza saturação dos tons de marca no tema escuro.
- **Valide o contraste de novo no tema escuro** — o que passa no claro pode falhar no escuro (e vice-versa). Teste os dois temas com as mesmas regras AA (4.5:1 texto, 3:1 UI).
- Ofereça **toggle claro/escuro/sistema** e respeite a preferência do sistema operacional (`prefers-color-scheme`).

---

## 7. Estrutura de pastas recomendada (React + TypeScript)

Estrutura padrão da indústria (referências: shadcn/ui, Storybook, monorepos Turborepo). Dois cenários:

### 7.1 Cenário A — Design system dentro do próprio app (ZAPP v3, recomendado para começar)

```
src/
├── components/
│   ├── ui/                  ← BIBLIOTECA DO DESIGN SYSTEM
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx    (Storybook)
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── Badge/
│   │   ├── Avatar/
│   │   └── Toast/
│   ├── features/            ← PÁGINAS/TELAS (montam com o design system)
│   │   ├── chat/
│   │   ├── contacts/
│   │   └── settings/
│   └── layout/              ← organismos de layout (Sidebar, Header)
├── tokens/                  ← DESIGN TOKENS (fonte da verdade)
│   ├── colors.json
│   ├── spacing.json
│   ├── typography.json
│   └── radius-shadows.json
├── styles/
│   ├── tokens.css           (gerado a partir dos JSON — Style Dictionary)
│   ├── globals.css
│   └── themes/
│       ├── light.css
│       └── dark.css
├── hooks/
├── lib/
└── utils/
```

**Regras de convivência:**
- `components/ui/` só contém peças **genéricas e reutilizáveis** (sem regra de negócio).
- Telas e regras de negócio vão em `features/` e **importam apenas** de `ui/` + `tokens/`.
- Um componente de `ui/` **nunca** importa de `features/` (dependência sempre para dentro).
- Padrão de arquivos por componente: `Componente.tsx` + `Componente.stories.tsx` + `Componente.test.tsx` + `index.ts` (barrel).

### 7.2 Cenário B — Design system como pacote separado (escala multi-app)

Quando o sistema servir vários apps (ZAPP + site institucional + app do cliente):

```
meu-design-system/
├── packages/
│   ├── tokens/              ← JSON de tokens + build Style Dictionary
│   ├── ui/                  ← componentes React (Button, Input…)
│   ├── icons/               ← ícones SVG
│   └── docs/                ← Storybook + documentação
├── apps/
│   ├── zapp-web/            ← o app consome os pacotes
│   └── landing/             ← outro app, mesmos tokens/componentes
├── turbo.json               (orquestração monorepo)
├── package.json             (workspaces)
└── tsconfig.base.json
```

> **Recomendação para a Promo Brindes:** comece pelo **Cenário A** (dentro do ZAPP). Ele já entrega 90% dos benefícios. Migre para o Cenário B só quando existir um segundo app consumindo o mesmo sistema.

---

## Resumo executivo (o que levar deste documento)

1. **Design system = fonte única da verdade visual**: peças prontas + regras + documentação → consistência, velocidade (devs montam, não reinventam) e manutenção barata (rebranding = 1 mudança, não 100).
2. **Tokens primeiro**: nomeie `color.brand.primary.500` (categoria.propriedade.variante.estado), separe primitivos → semânticos → componente, use escala de espaçamento base 4px (`space.1`–`space.16`), e nunca use valores crus no código.
3. **Atomic Design** organiza o caos: átomos (botão, input) → moléculas (busca, bolha de mensagem) → organismos (card de conversa) → templates (layout 3 colunas) → páginas (conversa real).
4. **Componentes core com estados completos**: default, hover, active, focus, disabled, loading, error, success — focus sempre visível, nunca cor sozinha para comunicar estado.
5. **Tipografia e cores com regra matemática**: escala modular base 16px arredondada a múltiplos de 4, line-height 1.5×; contraste WCAG AA (4.5:1 texto, 3:1 UI) medido com ferramenta; dark mode via tokens semânticos (sem preto puro).

---

### Fontes pesquisadas

- Nielsen Norman Group — *Design Systems 101*: nngroup.com/articles/design-systems-101
- Brad Frost — *Atomic Design* (livro online): atomicdesign.bradfrost.com
- Figma — *Design Systems 101*: figma.com/blog/design-systems-101-what-is-a-design-system
- design.dev — *Design Systems & Design Tokens Explained*: design.dev/guides/design-systems
- designsystems.com — *Typography Guide* (por Figma)
- NN/g — *Button States: Communicate Interaction*; Figma Resource Library — *Button States*; USWDS — *Button component*
- WCAG 2.1 — critérios 1.4.3 (Contrast Minimum AA: 4.5:1 / 3:1) e 1.4.11 (Non-text Contrast: 3:1); guias de dark mode acessível (accessibilitychecker.org, dubbot.com)
- Storybook — *Structuring your Storybook*; shadcn/ui — *Monorepo* docs; Toptal — *The Benefits of a Design System*
