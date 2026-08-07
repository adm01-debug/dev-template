# Design System: Ferramentas e Implementação — Guia Prático

> **Para quem:** Joaquim (Promo Brindes) e o time de desenvolvimento dos projetos (ZAPP Web v3 — app de atendimento omnichannel estilo WhatsApp Business, React + Vite + TypeScript).
> **Objetivo:** escolher as melhores ferramentas de design e a melhor forma de implementar um design system no código, com acessibilidade, dark mode e evolução segura.
> **Nível:** prático e acionável. Cada seção termina com "O que fazer no ZAPP Web v3".
> **Fontes:** W3C Design Tokens Community Group, Tokens Studio, Style Dictionary, shadcn/ui, Radix UI, Storybook, Tailwind CSS, WCAG 2.2 (W3C), Design Systems Collective, UXPin.

---

## Sumário

1. [Ferramentas de design: Figma, Tokens Studio, Style Dictionary e especificação W3C](#1-ferramentas-de-design)
2. [Implementação em código: CSS variables vs Tailwind vs CSS Modules vs styled-components](#2-implementação-em-código)
3. [shadcn/ui e Radix UI: o que são e quando valem a pena](#3-shadcnui-e-radix-ui)
4. [Storybook: documentação visual de componentes](#4-storybook)
5. [Acessibilidade: WCAG AA na prática](#5-acessibilidade-wcag-aa)
6. [Dark mode: estratégias e implementação](#6-dark-mode)
7. [Versionamento e evolução do design system](#7-versionamento-e-evolução)
8. [Recomendação final para o ZAPP Web v3](#8-recomendação-final-para-o-zapp-web-v3)
9. [Fontes](#9-fontes)

---

## 1. Ferramentas de design

### 1.1 Figma — onde o design acontece

O Figma é o padrão da indústria para design de interfaces. Para um design system, o que interessa nele são:

- **Figma Variables** (funcionalidade nativa): permite definir cores, espaçamentos, tipografia e raios como "variáveis" reutilizáveis dentro do arquivo. Mudou uma vez, atualiza em todos os lugares. Suporta **modos** (ex.: light e dark) — um mesmo token tem valores diferentes por modo.
- **Componentes e Variants**: um botão com variantes (primary, secondary, danger, tamanhos) que os designers arrastam e soltam nas telas.
- **Bibliotecas de equipe** (Team Libraries): publica componentes e estilos para outros arquivos consumirem com um clique.

> ⚠️ Importante: variáveis do Figma ficam presas no Figma. Para o código receber esses valores automaticamente, entra o Tokens Studio (seção 1.2).

### 1.2 Tokens Studio for Figma — a ponte entre design e código

**O que é:** plugin do Figma (o mais adotado do mercado) que transforma as decisões de design em **design tokens** — arquivos JSON estruturados, legíveis por máquina.

**Fluxo de trabalho recomendado (o que equipes de design system grandes fazem):**

1. Designer define os tokens no Tokens Studio dentro do Figma (cores, tipografia, espaçamento, raio, sombras, etc.).
2. Tokens Studio sincroniza os tokens como JSON para um **repositório no GitHub** (um PR automático a cada alteração).
3. O **Style Dictionary** (seção 1.3) transforma esse JSON em código pronto para cada plataforma: `:root { --color-primary: #... }` para CSS, config do Tailwind, variáveis para iOS/Android etc.
4. Desenvolvedores consomem o código gerado — sem copiar valores manualmente, sem "drift" (design e código dessincronizados).

**Por que usar:** elimina o erro humano de "o desenvolvedor copiou a cor errada do Figma". A fonte da verdade é uma só.

**Alternativa nativa:** dá para exportar variáveis do Figma direto em formato de tokens (o Figma exporta JSON no formato da especificação W3C), mas o Tokens Studio oferece mais controle (sets, temas, aliases, documentação).

### 1.3 Style Dictionary — tokens → código de verdade

**O que é:** ferramenta open source (Amazon) que lê um JSON de tokens e **gera código para qualquer plataforma**: CSS variables, SCSS, JavaScript/TypeScript, JSON para iOS/Android, config do Tailwind, etc.

**Como funciona (3 passos):**

```bash
# 1. Instalar (junto com o pacote de integração do Tokens Studio)
npm install style-dictionary @tokens-studio/sd-transforms
```

```jsonc
// 2. tokens.json (exemplo simplificado no formato W3C)
{
  "color": {
    "primary": { "$value": "#0066CC", "$type": "color" },
    "surface":  { "$value": "#FFFFFF", "$type": "color" }
  },
  "spacing": {
    "sm": { "$value": "8px", "$type": "dimension" }
  }
}
```

```js
// 3. config.js — gera os arquivos de saída
import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  source: ['tokens/**/*.json'],
  platforms: {
    css:   { transformGroup: 'tokens-studio', buildPath: 'dist/css/',   files: [{ destination: 'variables.css', format: 'css/variables' }] },
    js:    { transformGroup: 'tokens-studio', buildPath: 'dist/js/',    files: [{ destination: 'tokens.js', format: 'javascript/es6' }] },
    tailwind: { transformGroup: 'tokens-studio', buildPath: 'dist/tw/', files: [{ destination: 'tailwind.tokens.json', format: 'tailwind/tokens' }] },
  }
});
sd.buildAllPlatforms();
```

**Resultado:** `dist/css/variables.css` com `--color-primary: #0066CC;` pronto para importar no app.

**Bônus:** o [Style Dictionary Configurator](https://configurator.tokens.studio/) permite testar transformações no navegador, sem instalar nada.

### 1.4 Especificação de Design Tokens (W3C / DTCG) — o padrão do futuro

- O **W3C Design Tokens Community Group** publicou em outubro de 2025 a **primeira versão estável** da especificação de design tokens (2025.10).
- Ela define um **formato JSON padrão e neutro de fornecedor** para trocar tokens entre ferramentas: cada token tem `$value`, `$type` (color, dimension, fontFamily, etc.) e `$description`.
- **Por que importa:** seus tokens em JSON padrão W3C funcionam em qualquer ferramenta do mercado (Figma, Tokens Studio, Style Dictionary, Adobe, etc.) sem código de integração sob medida. Você não fica refém de nenhum fornecedor.
- **Prática recomendada:** armazenar os tokens no formato W3C desde o início. É o formato que Tokens Studio exporta e que Style Dictionary consome.

### ✅ O que fazer no ZAPP Web v3

1. Organizar o arquivo Figma do ZAPP com **componentes + variáveis** (cores da marca Promo Brindes, tons de cinza, status de chat: aberto/aguardando/finalizado).
2. Instalar **Tokens Studio** no Figma e conectar ao repositório do projeto (pasta `tokens/` no GitHub).
3. Adicionar **Style Dictionary** ao build (script `npm run tokens`) para gerar `variables.css` e o tema do Tailwind a partir do mesmo JSON.
4. Usar **formato W3C** nos JSONs — já é estável e é o padrão para onde a indústria caminha.

---

## 2. Implementação em código

Para um projeto **React + Vite + TypeScript**, quatro abordagens dominam. A boa notícia: **não são mutuamente exclusivas** — CSS variables combinam com todas.

### 2.1 CSS Variables (Custom Properties)

Tokens nativos do CSS, definidos em `:root` e sobrescritos por tema.

```css
:root {
  --color-primary: #0066cc;
  --color-text: #1a1a1a;
  --spacing-md: 16px;
  --radius-md: 8px;
}
```

| Prós | Contras |
|---|---|
| Funcionam em qualquer stack, sem biblioteca | Nenhum escopo automático (cascade global) |
| Troca de tema em runtime com custo ~zero (só troca o valor da variável) | Verboso se usado sozinho para tudo |
| Nativos do navegador, sem bundle extra | Sem lógica (não dá para fazer "se hover, então...") |
| Base perfeita para dark mode | Nomes livres — precisa de disciplina/nomenclatura |

**Uso recomendado:** como **camada de tokens** em qualquer stack. Todo o design system deveria ter suas cores/espaços/tipografia em CSS variables, independentemente do resto.

### 2.2 Tailwind CSS

Framework **utility-first**: classes atômicas (`bg-primary`, `p-4`, `rounded-md`) compostas no JSX, geradas a partir de um tema central.

```tsx
<button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
  Enviar
</button>
```

| Prós | Contras |
|---|---|
| Prototipagem muito rápida, consistência via tema único | Markup fica poluído de classes (menos legível) |
| CSS final pequeno (só gera o que é usado — JIT/purge) | Curva de aprendizado dos nomes das classes |
| Ótimo ecossistema (IntelliSense no VS Code, shadcn/ui) | Você não "vê" o CSS do componente de relance |
| Integra-se bem com design tokens (config ou CSS variables) | É uma decisão arquitetural: difícil trocar depois |
| Dark mode nativo com variante `dark:` | — |

### 2.3 CSS Modules

CSS "normal" com **escopo local por arquivo**: o build (Vite) embaralha os nomes das classes para não colidirem.

```tsx
// Button.module.css
.button { background: var(--color-primary); padding: var(--spacing-md); }

// Button.tsx
import styles from './Button.module.css';
export function Button() { return <button className={styles.button}>Enviar</button>; }
```

| Prós | Contras |
|---|---|
| CSS padrão, familiar, sem runtime | Continua sendo cascade global (herança, especificidade) |
| Escopo automático, zero colisão de nomes | Verboso para estilos dinâmicos/condicionais |
| Estático em build-time (rápido, cacheável) | Ferramentas extras para tipar imports no TS |
| Funciona muito bem com CSS variables | Menos produtivo para layouts complexos rápidos |

### 2.4 styled-components (CSS-in-JS)

Estilos escritos em JavaScript, junto do componente, com suporte a props dinâmicas e `ThemeProvider`.

```tsx
const Button = styled.button`
  background: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md};
`;

// Tema via ThemeProvider
<ThemeProvider theme={lightTheme}>
  <Button>Enviar</Button>
</ThemeProvider>
```

| Prós | Contras |
|---|---|
| Estilos colados ao componente, fácil de achar | **Injeção de estilos em runtime**: JS extra e re-render |
| Estilos dinâmicos por props sem esforço | Tema em runtime: consumidores re-renderizam ao trocar tema |
| `ThemeProvider` facilita theming | Precisa de cuidado com SSR/FOUC (menos relevante em SPA Vite) |
| Sem conflito de nomes de classe | Bundle maior; estilos não são extraíveis para CSS estático |

### 2.5 Comparação lado a lado

| Critério | CSS Variables | Tailwind | CSS Modules | styled-components |
|---|---|---|---|---|
| Curva de aprendizado | Baixa | Média | Baixa | Média |
| CSS em build-time (rápido) | ✅ | ✅ | ✅ | ❌ (runtime) |
| Escopo de estilos | ❌ (global) | Nome de classe (combinável) | ✅ | ✅ |
| Theming/dark mode | ⭐ Excelente (troca em runtime) | Bom (variante `dark:`) | Bom (com CSS vars) | Bom (ThemeProvider, mas runtime) |
| TypeScript friendly | ✅ | ✅ (IntelliSense) | ⚠️ (precisa de tipagem) | ✅ |
| Bundle/performance | Zero custo | CSS pequeno | Zero custo | Custo de runtime |
| Melhor para design system | Base de tokens | Rápido + consistente | Componentes isolados | Componentes dinâmicos |

### ✅ O que fazer no ZAPP Web v3

**Recomendação: CSS variables (tokens) + Tailwind CSS.** É a combinação mais usada hoje em apps React+Vite+TS e é a base do shadcn/ui (seção 3), que resolve 80% dos componentes prontos.

- CSS variables = fonte da verdade dos tokens (geradas pelo Style Dictionary a partir do Figma).
- Tailwind = produtividade do dia a dia, referenciando as variáveis (`bg-[var(--color-primary)]` ou mapeando no tema).
- Evitar styled-components: o ZAPP é uma SPA com muitas listas/chat em tempo real — o custo de runtime e re-render não compensa.
- CSS Modules: útil pontualmente para componentes muito específicos, mas não como estratégia principal.

---

## 3. shadcn/ui e Radix UI

### 3.1 Radix UI — a fundação acessível

**O que é:** biblioteca open source (mantida pela WorkOS) de **primitivos headless** (sem estilo) para React: Dialog, Dropdown, Select, Tabs, Toast, Tooltip, etc.

**O que ela resolve:** as partes difíceis de UI que ninguém quer reimplementar — **acessibilidade WAI-ARIA** (atributos `aria-*` corretos), **navegação por teclado**, **gerenciamento de foco**, comportamento de modais (travar scroll, fechar com Esc, foco preso dentro), etc.

**Características:**
- **Zero estilos**: qualquer abordagem de CSS funciona por cima (Tailwind, CSS Modules, styled-components).
- Estado exposto via atributos `data-state` (ex.: `[data-state="open"]`) — fácil de estilizar.
- Prop `asChild` permite renderizar qualquer elemento seu.
- Não é "bonito" por padrão — você estiliza.

```tsx
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root>
  <Dialog.Trigger className="...">Abrir chat</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Content className="...">Conteúdo do modal</Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### 3.2 shadcn/ui — componentes bonitos que são SEUS

**O que é:** o shadcn/ui **não é uma biblioteca de componentes tradicional** (você não instala do npm e importa). É um **modelo de distribuição "copy-paste"**: a CLI copia o código-fonte dos componentes para dentro do seu repositório.

> Frase oficial: "**This is not a component library. It is how you build your component library.**" — Não é uma biblioteca; é como você constrói a SUA biblioteca.

**Como funciona:**

```bash
# Configurar (detecta Vite + React + Tailwind)
npx shadcn@latest init

# Adicionar um componente — o código cai em components/ui/
npx shadcn@latest add button dialog select
```

**O que acontece:** os arquivos dos componentes (com estilos Tailwind, variantes via `class-variance-authority` e comportamento via Radix) são copiados para `components/ui/`. **A partir daí, o código é seu**: sua equipe revisa em PR, edita, remove, customiza — como qualquer componente escrito por vocês.

**Pilares (docs oficiais):**
1. **Open Code** — código aberto e editável, sem "caixa preta".
2. **Composição** — interface comum e previsível entre componentes.
3. **Distribuição** — CLI + schema plano (registry).
4. **Beautiful Defaults** — visual cuidado de fábrica.
5. **AI-Ready** — código aberto que LLMs leem e melhoram (ótimo para o fluxo de trabalho com agentes de IA).

**Base técnica:** Radix (comportamento/acessibilidade) + Tailwind (estilo) + CSS variables (tokens) + CVA (variantes). **Tailwind é dependência obrigatória.**

### 3.3 shadcn/ui vs Radix — qual usar?

Eles **não competem**: o shadcn/ui usa Radix por baixo na maioria dos componentes interativos. A escolha real é:

| Critério | shadcn/ui | Radix UI (primitivos) |
|---|---|---|
| Distribuição | CLI copia código para seu repo | Pacote npm (`@radix-ui/react-*`) |
| Quem é dono do código | **Você** (edita direto) | A biblioteca (você estiliza em volta) |
| Estilo | Pronto (Tailwind + CSS variables) | Zero estilo — você faz tudo |
| Atualizações | Você gerencia (copiou = seu) | Via `npm update` |
| Acessibilidade | Herdada do Radix | WAI-ARIA de fábrica |
| Quando vale | App padrão, já usa Tailwind, quer velocidade | Stack sem Tailwind, design system bespoke, componentes com markup muito específico |

**Quando o shadcn/ui vale a pena:**
- App React+Vite+TS com Tailwind (caso do ZAPP Web v3) — acelera muito a construção.
- Você quer **possuir** os componentes (customização total para a marca).
- Precisa de padrões prontos: Data Table, Sidebar, Command palette, Forms com React Hook Form.

**Quando NÃO vale:**
- Projeto sem Tailwind (aí use Radix direto).
- Publicar uma biblioteca de componentes para outros times consumirem via npm (modelo package é melhor).
- Componentes com estrutura muito flexível (o copy-paste vira amarração).

**Cuidados:**
- Como o código é copiado, **correções de acessibilidade/bugs do shadcn NÃO chegam sozinhas** — é preciso re-sincronizar (`npx shadcn@latest update` ou diff manual) ou aplicar o fix localmente.
- Não misturar com outra biblioteca de UI (ex.: MUI/AntD) — APIs e estilos conflitam.

### ✅ O que fazer no ZAPP Web v3

1. **Adotar shadcn/ui como base** dos componentes de interface (botões, inputs, dialogs, selects, toasts, sidebar, data table do painel de chats).
2. Mapear os tokens da marca (cores Promo Brindes) nas CSS variables do tema do shadcn (`--primary`, `--background`, etc.) — tema inteiro muda em um lugar.
3. Componentes de chat específicos (bolhas de mensagem, compositor, lista de conversas) ficam como componentes próprios, usando os primitivos do shadcn onde fizer sentido.
4. Manter um fluxo periódico de `shadcn update` para receber melhorias upstream.

---

## 4. Storybook

**O que é:** ferramenta padrão da indústria para **desenvolver e documentar componentes de UI isoladamente**. Cada componente ganha "stories" (histórias) = estados/variantes renderizados numa vitrine visual interativa. Serve como **catálogo vivo + documentação + ambiente de teste** do design system.

### 4.1 Instalação no Vite (React + TS)

```bash
# Na raiz do projeto (detecta Vite + React automaticamente)
npm create storybook@latest
# ou, se o projeto já existe:
npx storybook@latest init
```

**Requisitos:** React ≥ 16.8, Vite ≥ 5.

**O que é criado:**
- `.storybook/main.ts` — configuração (onde estão as stories, addons, framework).
- `.storybook/preview.ts` — decorações globais (tema, providers, CSS global).
- `src/components/**/*.stories.tsx` — as histórias.

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: { name: '@storybook/react-vite', options: {} },
  docs: { autodocs: 'tag' },
};
export default config;
```

### 4.2 Escrevendo uma story

```tsx
// src/components/ui/button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: { docs: { description: { component: 'Botão padrão do ZAPP. Variantes: default, destructive, outline, ghost.' } } },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'default', children: 'Enviar mensagem' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Excluir chat' } };
export const Loading: Story = { args: { variant: 'default', children: 'Enviando...', disabled: true } };
```

### 4.3 Comandos

```bash
npm run storybook        # dev server (porta 6006 por padrão)
npm run build-storybook  # build estático (pasta storybook-static) — publicar como documentação
```

### 4.4 Boas práticas

- **1 story por estado relevante**: default, hover, disabled, loading, erro, vazio (principalmente para listas de chats e estados de mensagem).
- **Autodocs (MDX)**: documentar props, exemplos e regras de uso ao lado do componente.
- **Addons essenciais**: Controls (brincar com props ao vivo), Actions, Viewport, A11y (teste automatizado de acessibilidade), Themes (alternar light/dark na vitrine).
- **Testes de regressão visual** (opcional, para time maior): Chromatic ou Playwright + `storybook test`.
- Publicar o build estático (Vercel/Netlify/GitHub Pages) para o time inteiro (inclusive não-devs) navegar no catálogo.

### ✅ O que fazer no ZAPP Web v3

- Rodar `npx storybook@latest init` e criar stories para os componentes de UI (botões, inputs, modais, cards de conversa, bolhas de mensagem).
- Ativar o addon **A11y** — ele aponta falhas de contraste e ARIA automaticamente.
- Publicar em um link do time (ex.: Vercel) para servir de catálogo visual do design system.

---

## 5. Acessibilidade (WCAG AA)

Acessibilidade não é opcional: é requisito legal em vários mercados, melhora o produto para todos e é barata quando feita desde o início. Regras WCAG 2.2 nível **AA** que importam para o ZAPP:

### 5.1 Contraste de cores (1.4.3)

| Elemento | Contraste mínimo |
|---|---|
| Texto normal | **4.5:1** |
| Texto grande (≥ 24px normal ou ≥ 19px bold) | 3:1 |
| Componentes de UI e gráficos (bordas de input, ícones de estado, foco) | 3:1 (1.4.11) |

**Na prática:**
- Nunca usar cinza-claro sobre branco para texto (ex.: `#999` sobre `#fff` = ~2.8:1 ❌).
- Testar com ferramentas: **axe DevTools**, **Lighthouse**, addon A11y do Storybook, ou calculadoras (WebAIM Contrast Checker).
- **Tokenizar as cores com contraste em mente**: definir no design system pares "texto sobre superfície" já validados, e proibir uso direto de hex solto no código.

### 5.2 Foco visível (2.4.7 — AA) e aparência do foco (2.4.13 — AAA)

Todo elemento interativo precisa mostrar **claramente** onde está o foco do teclado.

```css
/* Boa prática: nunca remover outline sem substituto visível */
:focus-visible {
  outline: 2px solid var(--color-focus);   /* cor com ≥ 3:1 contra o fundo */
  outline-offset: 2px;
}

/* ❌ Anti-padrão comum */
*:focus { outline: none; }
```

- Usar `:focus-visible` (só mostra para navegação por teclado, não para clique do mouse).
- Padrão recomendado: indicador de **2px+** com contraste ≥ 3:1 — vale para inputs, botões, links, itens de lista de chats.

### 5.3 ARIA labels e semântica

- Elementos interativos sem texto visível (ícones de ação no chat, botões de anexo) precisam de nome acessível:

```tsx
<button aria-label="Enviar mensagem">
  <SendIcon />
</button>
```

- Usar elementos semânticos nativos (`<button>`, `<input>`, `<nav>`, `<ul>`) em vez de `<div onClick>`.
- Formulários com `<label>` associado (ou `aria-labelledby`).
- Mensagens de erro de input com `aria-live` ou `role="alert"` para leitores de tela anunciarem.
- Modal: foco preso dentro, fechar com Esc, `aria-labelledby` apontando para o título — o Radix (usado pelo shadcn) já entrega isso de fábrica.

### 5.4 Tamanho de alvo de toque (2.5.8 — AA: 24×24; recomendação prática: 44×44)

| Padrão | Tamanho mínimo do alvo |
|---|---|
| WCAG 2.2 AA (obrigatório) | **24 × 24 CSS pixels** |
| Boa prática mobile / WCAG AAA | **44 × 44 CSS pixels** |

- Vale para botões, ícones clicáveis, abas, itens de lista, checkboxes.
- Se o alvo visual for menor (ex.: ícone de 16px), aumentar a **área clicável** com padding ou pseudo-elemento, mantendo o visual.
- No ZAPP (muito uso em celular — atendimento omnichannel!), usar **44px** como padrão dos botões de ação do chat.

```css
.icon-button {
  min-width: 44px;   /* área de toque */
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

### 5.5 Checklist rápido de AA para o ZAPP

- [ ] Texto sempre ≥ 4.5:1 contra o fundo (validar cores de status: online/offline/aguardando).
- [ ] Nenhum `outline: none` sem substituto; `:focus-visible` com 2px e contraste.
- [ ] Todos os ícones clicáveis com `aria-label`.
- [ ] Alvos de toque ≥ 44px nos controles móveis.
- [ ] Formulários (login, cadastro de contato) com labels e erros anunciáveis.
- [ ] Rodar axe DevTools + Lighthouse a cada release; addon A11y do Storybook nos componentes.
- [ ] Testar navegação 100% por teclado (Tab, Enter, Esc) no fluxo de atendimento.

---

## 6. Dark mode

### 6.1 Estratégias

| Estratégia | Como funciona | Uso recomendado |
|---|---|---|
| **Só `prefers-color-scheme`** | CSS media query segue o tema do sistema operacional | Mínimo viável; sem controle do usuário dentro do app |
| **CSS variables + toggle manual** | Tokens em `:root`; tema dark sobrescreve as variáveis via classe/atributo no `<html>`; preferência salva em `localStorage` | ⭐ Padrão da indústria — controle total |
| **Híbrido (sistema + toggle)** | Padrão = tema do sistema; usuário pode forçar light/dark | ⭐ Melhor UX (3 estados: claro, escuro, sistema) |

### 6.2 Implementação recomendada (CSS variables + 3 estados)

```css
/* tokens-base.css */
:root {
  --color-background: #ffffff;
  --color-text: #1a1a1a;
  --color-primary: #0066cc;
  /* ... */
}
html[data-theme='dark'] {
  --color-background: #121212;
  --color-text: #f5f5f5;
  --color-primary: #4d9fff;
}
```

```tsx
// useTheme.ts — hook de tema (sistema + manual)
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem('theme') as Theme) || 'system'
  );

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const dark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.setAttribute('data-theme', dark ? 'dark' : 'light');
      root.style.colorScheme = dark ? 'dark' : 'light'; // scrollbars, form controls nativos
    };
    apply();
    localStorage.setItem('theme', theme);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply); // reage se o sistema mudar
    return () => mq.removeEventListener('change', apply);
  }, [theme]);

  return { theme, setTheme };
}
```

**Anti-FOUC (piscada de tema errado ao carregar):** aplicar o tema antes do React montar, com script inline no `index.html`:

```html
<script>
  (function () {
    var t = localStorage.getItem('theme') || 'system';
    var dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  })();
</script>
```

### 6.3 Dark mode no Tailwind e no shadcn/ui

- **Tailwind** (v4): por padrão a variante `dark:` segue `prefers-color-scheme`. Para toggle manual por classe:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

- **shadcn/ui**: dark mode nativo via classe `.dark` no `<html>` + tokens CSS duplicados (`--background`, `--foreground`, etc. para light e dark). A documentação oficial tem guias para Vite.
- **Propriedade `color-scheme`**: definir `color-scheme: light`/`dark` no `<html>` deixa scrollbars, inputs e selects nativos no tema certo sem esforço.
- **`light-dark()` (CSS moderno)**: função que escolhe o valor conforme o tema — útil para casos pontuais; ainda exige `color-scheme` configurada.

### ✅ O que fazer no ZAPP Web v3

1. Adotar **3 estados** (claro / escuro / sistema) com `data-theme` no `<html>` + `localStorage`.
2. Todas as cores como CSS variables — **nenhum hex solto em componente** (senão o dark mode vaza).
3. Script inline anti-FOUC no `index.html`.
4. Se usar shadcn/ui: usar o mecanismo `.dark` oficial dele e garantir que os addons/testes cobrem os dois temas.
5. Validar contraste **nos dois temas** (o contraste 4.5:1 vale para ambos).

---

## 7. Versionamento e evolução

Um design system vivo muda sempre. O problema não é mudar — é mudar **sem quebrar os apps que o usam**. A resposta da indústria é **SemVer + deprecação em fases**.

### 7.1 Semantic Versioning (SemVer)

Formato `MAJOR.MINOR.PATCH` (ex.: `2.3.1`):

| Incremento | Quando | Exemplos no ZAPP |
|---|---|---|
| **MAJOR** (2 → 3) | **Breaking change**: quebra API, visual ou comportamento | Renomear prop `type` → `variant`; mudar cor primária do tema; trocar estrutura do Card |
| **MINOR** (3.1 → 3.2) | Nova funcionalidade **sem quebrar** nada | Novo componente `Avatar`, nova variante de botão |
| **PATCH** (3.2.1 → 3.2.2) | Correção de bug | Fix de contraste, conserto de foco |

**Importante para design system:** mudança **visual** também é breaking (o usuário vê!). Trocar a cor primária da marca é MAJOR, mesmo que o código compile.

### 7.2 Processo de deprecação em 3 fases

1. **Fase 1 — Aviso (MINOR):** marcar o componente/prop como deprecated, manter funcionando, documentar a alternativa.
   ```ts
   /** @deprecated Use `variant="destructive"` em vez de `type="danger"`. Remoção prevista: v3.0.0 */
   type?: 'danger';
   ```
2. **Fase 2 — Período de migração (3–6 meses):** avisos no console (`console.warn`), documentação de migração, tracking de quem ainda usa a API antiga.
3. **Fase 3 — Remoção (MAJOR):** remover a API antiga, publicar `3.0.0` com changelog e guia de migração.

### 7.3 Boas práticas de evolução

- **CHANGELOG sempre**: cada release documenta o que mudou, o que quebra e como migrar. Template:
  ```markdown
  ## [3.0.0] - 2026-08-01
  ### Breaking
  - Renomeado `Button type="danger"` → `variant="destructive"` (codemod disponível)
  - Cor primária atualizada para a nova identidade Promo Brindes
  ### Adicionado
  - Novo componente `MessageBubble`
  ### Corrigido
  - Contraste do texto de status "aguardando" (agora 4.6:1)
  ```
- **Codemods**: scripts que migram o código dos consumidores automaticamente (ex.: rename de prop). Essenciais quando há muitos apps usando o system.
- **Guias de migração práticos**: "antes/depois" com código, não texto genérico.
- **Comunicação com calendário**: avisar 3–6 meses antes, 1 mês antes, 2 semanas antes, no dia e após o release.
- **Suporte a versões antigas**: quando necessário, manter branch `main` (novo) + branch de manutenção da versão anterior com janela de suporte definida (ex.: v2 recebe fix de segurança até data X).
- **Emergências**: bug crítico de segurança pode exigir breaking imediato — comunicar urgência, shipar o mínimo, e o processo normal segue depois.
- **Métricas de saúde**: % de apps na última MAJOR (meta: 80% em 3 meses), % de uso de APIs deprecated (meta: <10%).

### ✅ O que fazer no ZAPP Web v3

1. Versionar os componentes/tokens com SemVer desde o início (mesmo que no começo seja `0.x`).
2. Nunca remover prop/componente sem o ciclo aviso → período de migração → remoção.
3. Manter CHANGELOG e marcar `@deprecated` no código com data de remoção.
4. Tratar mudança visual de marca como MAJOR.
5. Ao adotar shadcn/ui: registrar em changelog próprio as customizações locais, para saber o que re-sincronizar.

---

## 8. Recomendação final para o ZAPP Web v3

**Stack proposta (tudo open source, combina com React + Vite + TS):**

| Camada | Ferramenta | Papel |
|---|---|---|
| Design | Figma + Tokens Studio | Componentes e variáveis; tokens em JSON (formato W3C) |
| Tokens → código | Style Dictionary + `@tokens-studio/sd-transforms` | Gera CSS variables + tema Tailwind a partir do JSON |
| Estilos | **CSS variables + Tailwind CSS** | Tokens em runtime + produtividade utility-first |
| Componentes | **shadcn/ui (sobre Radix UI)** | Base pronta, acessível, 100% customizável e sua |
| Documentação | **Storybook (+ addon A11y)** | Catálogo vivo, testes de acessibilidade e regressão |
| Acessibilidade | WCAG 2.2 AA | Contraste 4.5:1, foco visível, ARIA, alvos 44px |
| Temas | `data-theme` + `localStorage` + `prefers-color-scheme` | Dark mode com 3 estados, sem FOUC |
| Evolução | SemVer + deprecação em 3 fases + CHANGELOG | Mudanças previsíveis e sem quebrar produção |

**Resultado:** uma única fonte da verdade (tokens no GitHub) alimentando design e código, componentes consistentes e acessíveis, dark mode de graça, e evolução segura — tudo mantendo a velocidade de desenvolvimento com agentes de IA (shadcn/ui é "AI-ready" e Storybook documenta o comportamento visual para qualquer um).

---

## 9. Fontes

- W3C Design Tokens Community Group — especificação estável 2025.10: https://www.w3.org/community/design-tokens
- Tokens Studio for Figma (docs): https://docs.tokens.studio
- Tokens Studio + Style Dictionary/SD-Transforms: https://docs.tokens.studio/transform-tokens/style-dictionary
- Style Dictionary: https://styledictionary.com
- shadcn/ui (docs): https://ui.shadcn.com/docs
- shadcn/ui Dark Mode: https://ui.shadcn.com/docs/dark-mode
- shadcn/ui vs Radix UI (Vercel): https://vercel.com/i/shadcn-vs-radix
- Radix UI: https://www.radix-ui.com
- Storybook — React com Vite: https://storybook.js.org/docs/get-started/frameworks/react-vite
- Tailwind CSS — Dark mode: https://tailwindcss.com/docs/dark-mode
- WCAG 2.2 (W3C): https://www.w3.org/TR/WCAG22
- Understanding SC 2.5.8 Target Size: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- web.dev — prefers-color-scheme: https://web.dev/articles/prefers-color-scheme
- Design Systems Collective — Versioning sem quebrar sites: https://www.designsystemscollective.com/versioning-your-design-system-without-breaking-client-sites-93b7c652f960
- UXPin — Component vs Design System Versioning: https://www.uxpin.com/studio/blog/component-versioning-vs-design-system-versioning
- Makers' Den — Tailwind vs CSS Modules vs styled-components: https://makersden.io/blog/tailwind-css-vs-css-modules-vs-styled-components
