# 🔍 Auditoria do Design System — ZAPP Web v3

**Data:** 06/08/2026
**Projeto auditado:** `C:/zapp-web-v3` (app de atendimento omnichannel estilo WhatsApp Business)
**Objetivo:** Avaliar o design system existente (tokens, componentes, acessibilidade) e listar o que falta para o padrão ideal.

---

## 1. Estado Atual — Resumo Executivo

O ZAPP Web v3 **já possui um design system maduro e bem estruturado**. Não se trata de um projeto sem design system — ele tem tokens centralizados, biblioteca de componentes grande e até uma ferramenta automatizada de auditoria. O que falta é **disciplina de aplicação** (violações pendentes), **documentação** e **automação de garantia de qualidade**.

### Arquitetura encontrada

| Camada                      | Arquivos                                                                        | Tamanho                                  |
| --------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------- |
| **Tokens de design**        | `src/styles/tokens.css`                                                         | 338 linhas, ~272 variáveis CSS           |
| **CSS modular**             | `src/styles/` (base, utilities, components, animations, sidebar, accessibility) | 1.321 linhas no total                    |
| **Config Tailwind**         | `tailwind.config.ts`                                                            | 346 linhas (mapeia tokens → utilitários) |
| **Componentes UI**          | `src/components/ui/`                                                            | **71 arquivos .tsx** + subpastas         |
| **Ferramenta de auditoria** | `scripts/check-design-system.ts` + `ds-config.ts` + teste                       | Automatizada                             |
| **Relatório existente**     | `design-system-audit.md` (raiz) + `docs/design-system-audit.md`                 | Gerado por script                        |
| **Storybook**               | `.storybook/` + `src/components/ui/stories/`                                    | 9 stories                                |
| **Presets de tema**         | `src/components/settings/theme/` (presets, useThemePreset, controles)           | Sistema de temas                         |

### O que o design system contém

1. **Design tokens (cores)** — HSL em CSS variables, com **light mode, dark mode e high-contrast mode**: `background`, `foreground`, `primary` (azul corporativo 221 83% 53%), `secondary`, `destructive`, `muted`, `accent`, `popover`, `card`, `success`, `warning`, `info` + tokens de **domínio**: `whatsapp`, `status` (online/away/offline/open/pending/resolved/waiting), `priority` (high/medium/low), `chat` (bolhas enviada/recebida), gamificação (`xp`, `coins`, `streak`, `rank-gold/silver/bronze`), `elevated`, 10 cores de gráfico (`chart-1..10`), gradientes e sombras (glow).
2. **Tipografia** — Fonte Inter (sans/display) + JetBrains Mono; escala fluida responsiva (`fluid-xs`…`fluid-4xl`) + escala modular 1.25 (`2xs`…`9xl`) com line-heights e letter-spacing definidos.
3. **Espaçamento** — Grid de 8px (2px a 96px) + tokens semânticos (`card`, `card-sm`, `section`).
4. **Radii, sombras, animações** — Raio derivado de `--radius`; 10+ sombras; 20+ keyframes (fade, slide, scale, shimmer, typing, glow-pulse, bounce-in…) com easing tokens.
5. **Acessibilidade** — `accessibility.css` com high-contrast, `prefers-reduced-motion`, `:focus-visible` com outline visível, alvos de 44px em mobile, `skip-link`, `visually-hidden`, e **correção WCAG AA validada de contraste** (78 pares em 2 temas, documentada em `docs/wcag-contrast-tokens-fix.md`).
6. **Componentes** — Biblioteca estilo shadcn/ui (Radix) + custom: `button`, `dialog`, `dropdown-menu`, `select`, `tabs`, `table`, `toast`/`sonner`, `command-palette`, `emoji-picker`, `empty-state`, `offline-indicator`, `skeleton`, `sparkline`, `step-progress`, `phone-input`, `sidebar`, entre outros.

### Relatório existente (`design-system-audit.md` na raiz)

É um relatório **gerado por script** (`scripts/check-design-system.ts`) que escaneia o código procurando:

- Cores literais proibidas (`bg-blue-100`, `text-red-800`, `bg-gray-100`…)
- Hex hardcoded (`#3b82f6`, `#EC4899`…)
- Fontes literais (`font-mono` fora de contexto técnico)

**Resultado do último relatório (243 linhas):** ~80 violações encontradas, a maioria **Low** (cores de marca legítimas — Google, WhatsApp, PDF, Office — na whitelist) e um conjunto de **Medium pendentes**:

- `EmailTemplatesManager.tsx` (linhas 54–57): `bg-blue-100/text-blue-800` → deveria ser `bg-primary/text-primary`; `bg-purple-100` → `bg-accent`; `bg-amber-100` → `bg-warning`; `bg-gray-100` → `bg-muted` (16 correções com sugestão pronta)
- `NotificationChannelsPage.tsx` (linhas 36–39): mesmo padrão `bg-blue-100` → `bg-primary`, `bg-red-100` → `bg-destructive` etc. (16 correções)
- `TagsView.tsx` (linhas 39–45): hex de tags (`#f97316`, `#06b6d4`, `#ec4899`) — "Check design system tokens"
- `font-mono` em ~30 ocorrências fora de contexto técnico (Medium) — revisar
- A coluna "Patch" está vazia: **as correções sugeridas ainda não foram aplicadas**

O relatório em `docs/design-system-audit.md` (16/07/2026) registra **0 violações** — era uma checagem anterior mais restrita.

---

## 2. Pontos Fortes ✅

1. **Tokens centralizados e semânticos** — cores em HSL com 3 modos (light/dark/high-contrast), tipografia fluida, grid de 8px, animações e sombras tokenizadas. Padrão moderno (shadcn + tokens CSS).
2. **Biblioteca UI grande e consistente** — 71 componentes com variantes e estados (padrão shadcn/Radix, acessíveis por construção).
3. **Ferramenta de auditoria automatizada** — `check-design-system.ts` com whitelist, modo CI (`--ci`), auto-fix (`--apply-patch`), dry-run e testes próprios. Raro em projetos do tipo.
4. **Acessibilidade acima da média** — high-contrast mode, reduced-motion, focus-visible, alvos 44px, skip-link, correção de contraste WCAG AA validada com script Python (78 pares).
5. **Tokens de domínio específicos** — WhatsApp, status, prioridade, chat, gamificação: o design system fala a língua do produto.
6. **Storybook configurado** e presets de tema com gamificação (XP, coins, ranks).
7. **Documentação de decisões** — docs de WCAG e de auditoria registram o "porquê" das correções.

---

## 3. Gaps — O Que Falta ❌

### G1 — Violações Medium pendentes (padrão ideal: zero classes literais)

O próprio relatório gerado aponta ~32 correções Medium com sugestão pronta (`bg-blue-100` → `bg-primary`, etc.) em 3 arquivos, e **nenhuma foi aplicada**. Cores "clássicas" do Tailwind convivem com os tokens.

### G2 — Uso incorreto de `font-mono` (~30 ocorrências Medium)

`font-mono` deve ser só para dados técnicos (IDs, logs, métricas). Vários usos em telas administrativas e diagnósticos precisam revisão para decidir manter (técnico) ou trocar.

### G3 — Hex hardcoded remanescentes (Low)

~30 ocorrências de cores hex fora dos tokens (tags em `TagsView.tsx`, `CreateQueueDialog.tsx`, logs de dev, `useEvolutionAutoReconnect.ts`, etc.). Aceitáveis em casos técnicos, mas sem token de origem ficam fora do controle de tema.

### G4 — Documentação dos componentes: cobertura baixa

Apenas **9 stories** (Button, Card, Dialog, Input, Link, Select, Textarea, Introduction) para 71 componentes (~13%). Sem docs de uso, variantes e estados, a consistência depende da memória dos devs. Não há documentação amigável para não-desenvolvedores (o dono do produto não consegue "ver" o design system).

### G5 — Garantia de qualidade não é contínua

O checker existe mas não roda automaticamente (sem hook/CI visível no fluxo). Sem visual regression tests (ex.: Chromatic/Playwright) e sem lint de acessibilidade automatizado (axe) no CI, regressões visuais e de contraste passam despercebidas.

### G6 — Contraste não validado para todos os tokens

A correção WCAG AA validou 78 pares de `success/info/destructive`, mas **não cobre** os tokens de gamificação (`xp`, `coins`, `streak`, `rank-*`), `status.*`, `priority.*` e `chat.*` — exatamente os mais usados em um app de atendimento.

### G7 — Sem fonte única de verdade para sincronia com design

Tokens vivem apenas em `tokens.css`. Não há spec.json/design tokens exportáveis (para Figma ou futuras plataformas), o que dificulta evoluir o visual sem tocar código.

---

## 4. Recomendações Priorizadas

### 🔴 P0 — Correções urgentes (baixo esforço, alto impacto)

| #   | Ação                                                                                                                                                                                              | Onde                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1   | Aplicar as correções Medium pendentes do relatório: `bg-blue-100`→`bg-primary`, `bg-purple-100`→`bg-accent`, `bg-amber-100`→`bg-warning`, `bg-gray-100`→`bg-muted`, `bg-red-100`→`bg-destructive` | `EmailTemplatesManager.tsx` (L54–57), `NotificationChannelsPage.tsx` (L36–39) |
| 2   | Rodar o checker em modo `--apply-patch` e gerar novo relatório zerado                                                                                                                             | `bun scripts/check-design-system.ts --apply-patch`                            |
| 3   | Integrar o checker no CI (modo `--ci`) e/ou pre-commit (lint-staged já existe) para impedir novas violações                                                                                       | `.github/workflows` + `.husky`                                                |

### 🟡 P1 — Importante (médio esforço)

| #   | Ação                                                                                                                                                                         |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4   | Revisar os ~30 usos de `font-mono`: manter só em dados técnicos; trocar por `font-sans` nos demais                                                                           |
| 5   | Validar contraste WCAG AA dos tokens de domínio (gamificação, status, priority, chat) com o script existente (`docs/wcag_contrast_tokens_fix.py`) e corrigir os que falharem |
| 6   | Expandir Storybook para os componentes principais não documentados (Badge, Alert, Tabs, Switch, Tooltip, Skeleton, EmptyState, Toast…) — priorizar os mais usados            |
| 7   | Adicionar visual regression testing (ex.: Chromatic ou Playwright) nos stories principais                                                                                    |
| 8   | Adicionar lint de acessibilidade (axe-core) ao CI para pegar erros de ARIA/contraste automaticamente                                                                         |

### 🟢 P2 — Melhoria contínua

| #   | Ação                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------- |
| 9   | Criar documentação amigável do design system (guia visual: cores, botões, componentes) para o dono do produto e para novos devs |
| 10  | Exportar os tokens para um `tokens.json`/spec versionado, fonte única de verdade (sincronizável com Figma)                      |
| 11  | Tokenizar os hex "Low" restantes quando fizerem sentido semântico (ex.: cores de tags em `TagsView.tsx`)                        |
| 12  | Considerar um "kit de componentes" visível dentro do app (a página de demo `ZappWebbDemoPage` pode evoluir para isso)           |

---

## 5. Veredito Final

**Nota geral: 8/10** — O ZAPP Web v3 tem uma base de design system **acima da média** para projetos Lovable/shadcn: tokens completos com 3 modos de tema, 71 componentes, ferramenta de auditoria própria e acessibilidade validada. Os gaps não são estruturais — são de **aplicação** (violações pendentes não corrigidas) e de **governança** (checker fora do CI, documentação de ~13% dos componentes, contraste não validado nos tokens de gamificação). Executando os 3 itens P0, o design system fica "verde" no próprio relatório; os P1/P2 transformam consistência pontual em consistência garantida.

---

_Auditoria gerada por inspeção direta do repositório: `tailwind.config.ts`, `src/index.css`, `src/styles/*` (7 módulos CSS), `src/components/ui/` (71 componentes), `scripts/check-design-system.ts`, `design-system-audit.md`, `docs/wcag-contrast-tokens-fix.md`, `.storybook/`._
