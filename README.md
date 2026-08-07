# 🚀 Dev Template — Promo Brindes

Template padrão de projetos frontend com boas práticas de desenvolvimento, baseado nas melhores práticas da comunidade (CodelyTV + Vite) e no stack validado do ZAPP Web v3.

## Stack

| Camada     | Tecnologia                                       |
| ---------- | ------------------------------------------------ |
| Build      | Vite 6 (porta 8080)                              |
| UI         | React 18 + TypeScript (strict)                   |
| Estilo     | CSS Modules / SCSS (sua escolha)                 |
| Testes     | Vitest 4 + Testing Library                       |
| Lint       | ESLint 9 + typescript-eslint                     |
| Formatação | Prettier                                         |
| CI         | GitHub Actions (typecheck + lint + test + build) |

## Começando

```bash
bun install
bun run dev        # dev server na porta 8080
bun run check      # typecheck + lint + test + build (tudo)
bun run test       # testes
```

## Scripts

| Script      | O que faz                                       |
| ----------- | ----------------------------------------------- |
| `dev`       | Dev server com HMR na porta 8080                |
| `build`     | Build de produção em dist/                      |
| `preview`   | Serve o build na porta 4173                     |
| `typecheck` | Verifica tipos (tsc --noEmit)                   |
| `lint`      | ESLint (máx 10 warnings)                        |
| `format`    | Prettier --write                                |
| `test`      | Vitest                                          |
| `check`     | Ciclo completo: typecheck → lint → test → build |

## Boas práticas incluídas

- **TypeScript strict** — `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- **Alias `@`** → `src/` (imports limpos)
- **Porta fixa 8080** — padrão do ecossistema Promo Brindes
- **CI em 4 gates** — nada entra na main sem typecheck, lint, teste e build verdes
- **Env separado** — `.env` nunca versionado, `.env.example` documenta
- **Prettier + EditorConfig** — código formatado por padrão
- **Testes com Testing Library** — testa comportamento, não implementação

## Estrutura de pastas (CodelyTV)

```
src/
├── sections/    # Funcionalidades (cada uma com seus componentes/hooks/testes)
├── components/  # Componentes compartilhados
├── lib/         # Utilitários, API, tipos
├── test/        # Setup de testes
└── assets/      # Estilos e recursos
```

## Criando um projeto novo a partir deste template

1. No GitHub: **Use this template** → criar repo
2. Clone, `bun install`, `bun run dev`
3. Ajuste `package.json` (nome), `index.html` (título), README
4. Adicione o `.env` com as variáveis reais (veja `.env.example`)
5. `bun run check` antes de cada PR
