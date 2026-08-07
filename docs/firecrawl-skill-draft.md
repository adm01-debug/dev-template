# Skill Draft: Firecrawl — Scraping, Crawling e Download de Sites para IA

> **Rascunho de skill** — objetivo: dar ao usuário (não-dev) uma funcionalidade de "scraper" para baixar um site inteiro (código, camadas, funções e design system com cores/fontes) para modelagem e cópia de designs.
> Fontes: docs.firecrawl.dev (API Reference v1/v2), github.com/firecrawl/firecrawl, firecrawl.dev/pricing, httrack.com, getsinglefile.com, docs.crawl4ai.com. Pesquisa feita em ago/2026.

---

## 1. O que é Firecrawl e para que serve

**Firecrawl** é uma API de scraping/web crawling construída especificamente para IA. Em vez de devolver HTML cru (como scrapers tradicionais), ela converte páginas e sites inteiros em **Markdown limpo** ou **JSON estruturado** — o formato ideal para alimentar LLMs e agentes. É open source (licença AGPL-3.0, ~160k ⭐ no GitHub) e também oferecido como serviço hospedado (nuvem) com plano grátis.

### Para que serve (casos de uso práticos)

| Caso de uso                                                            | Endpoint             | O que entrega                                                                             |
| ---------------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------- |
| **Baixar/extrair um site inteiro** (todas as páginas em Markdown/HTML) | `crawl`              | Job assíncrono que percorre todas as URLs do site e retorna o conteúdo de cada página     |
| **Extrair o design system** (cores, fontes, espaçamentos, componentes) | `scrape` + `extract` | HTML/CSS renderizado de cada página + JSON estruturado (ex.: paleta de cores, tipografia) |
| **Converter sites em Markdown/JSON** para IA                           | `scrape`             | Página única convertida em `markdown`, `html`, `rawHtml`, `links`, `screenshot`, `json`   |
| **Descobrir a estrutura do site** (lista de URLs)                      | `map`                | Lista completa de URLs de um domínio em segundos                                          |
| **Extrair dados estruturados com linguagem natural**                   | `extract`            | Ex.: "extraia todos os planos e preços deste site" → JSON no schema que você definir      |
| **Buscar na web e já trazer o conteúdo completo**                      | `search`             | Resultados de busca + página inteira em Markdown (alternativa ao Google)                  |

### Diferenciais

- **Renderização de JavaScript**: sites SPA/React (Next.js, Vite, etc.) são renderizados em browser headless antes da extração — o wget clássico não faz isso.
- **Zero seletor**: não precisa escrever seletores CSS/XPath; o LLM faz a extração por prompt.
- **Anti-bot integrado**: proxies rotativos e modo `enhanced` para sites protegidos (Cloudflare, etc.).
- **Formato LLM-ready**: Markdown limpo por padrão, com opção de `rawHtml` para quem quer o código.
- **Open source / self-hosted**: pode rodar localmente via Docker (com limitações vs. nuvem).

---

## 2. Endpoints principais (com exemplos reais de chamada)

### 2.1 `POST /v1/scrape` (ou `/v2/scrape`) — página única

Extrai o conteúdo de **uma URL** nos formatos que você escolher. É o endpoint mais usado.

```bash
# Exemplo v1 (mais simples e difundido)
curl -X POST "https://api.firecrawl.dev/v1/scrape" \
  -H 'Authorization: Bearer fc-YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com"}'

# Exemplo v2 com formatos e opções
curl -X POST "https://api.firecrawl.dev/v2/scrape" \
  -H "Authorization: Bearer fc-YOUR-API-KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "formats": ["markdown", "html", "rawHtml", "links", "screenshot"],
    "onlyMainContent": true,
    "waitFor": 2000,
    "timeout": 60000,
    "mobile": false,
    "proxy": "auto",
    "location": { "country": "US", "languages": ["en-US"] }
  }'
```

**Resposta (formato resumido):**

```json
{
  "success": true,
  "data": {
    "markdown": "# Título da página\n\nConteúdo limpo em markdown...",
    "html": "<!DOCTYPE html><html>... (HTML processado)",
    "rawHtml": "<!DOCTYPE html><html>... (HTML bruto exatamente como veio)",
    "links": ["https://example.com/sobre", "https://example.com/contato"],
    "metadata": { "title": "...", "description": "...", "language": "pt-BR", "sourceURL": "..." }
  }
}
```

**Parâmetros úteis:**

- `formats`: `markdown` (padrão), `html`, `rawHtml`, `links`, `screenshot`, `json` (extração via LLM embutida no scrape).
- `onlyMainContent: true` — remove menus/rodapés/navegação, deixando só o conteúdo principal (economiza tokens).
- `waitFor` (ms) — espera extra para renderização JS.
- `timeout` — até 60000 ms.
- `actions`: lista de ações na página antes de extrair (`wait`, `click`, `screenshot`, `scroll`, `write`, `press`, `scrape`, `executeJavascript`...). Essencial para _infinite scroll_.
- `proxy`: `basic` (padrão), `enhanced` (anti-bot forte, custa até 5 créditos), `auto` (tenta basic e re-tenta enhanced).
- `mobile: true` — renderiza como celular (útil para checar layout responsivo).

---

### 2.2 `POST /v1/crawl` (ou `/v2/crawl`) — site inteiro (assíncrono)

Crawleia **todas as páginas** de um site a partir de uma URL raiz. Retorna um **job ID** — você consulta o status até `completed`.

```bash
# 1. Iniciar o crawl
curl -X POST "https://api.firecrawl.dev/v2/crawl" \
  -H "Authorization: Bearer fc-YOUR-API-KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "limit": 100,
    "maxDiscoveryDepth": 3,
    "includePaths": ["/blog/.*"],
    "excludePaths": ["/admin/.*", "/login"],
    "ignoreQueryParameters": true,
    "scrapeOptions": { "formats": ["markdown", "html"] }
  }'
```

**Resposta imediata:**

```json
{
  "success": true,
  "id": "crawl_123456789",
  "url": "https://api.firecrawl.dev/v2/crawl/crawl_123456789"
}
```

```bash
# 2. Consultar o status / resultado do job (polling)
curl -X GET "https://api.firecrawl.dev/v2/crawl/crawl_123456789" \
  -H "Authorization: Bearer fc-YOUR-API-KEY"

# 3. (Opcional) Cancelar o crawl
curl -X DELETE "https://api.firecrawl.dev/v2/crawl/crawl_123456789" \
  -H "Authorization: Bearer fc-YOUR-API-KEY"
```

**Resposta do GET (quando completo):**

```json
{
  "success": true,
  "status": "completed",
  "total": 87,
  "creditsUsed": 94,
  "data": [
    {
      "url": "https://example.com/",
      "markdown": "...",
      "html": "...",
      "metadata": { "title": "...", "statusCode": 200 }
    }
  ]
}
```

**Parâmetros-chave do crawl:**

- `limit` (padrão 10000) — máx. de páginas. **Cuidado**: cada página = ~1 crédito.
- `includePaths` / `excludePaths` — regex de pathname para filtrar (ex.: só `/blog/.*`).
- `maxDiscoveryDepth` — profundidade de navegação (0 = só a raiz + sitemap).
- `sitemap`: `include` (padrão), `skip`, `only`.
- `crawlEntireDomain: true` — segue também links "irmãos/pais" (não só filhos).
- `allowSubdomains` / `allowExternalLinks` — sair do domínio (cuidado).
- `delay` (segundos entre requisições) — respeitar rate limit do site alvo.
- `webhook` — objeto com URL para receber notificação quando terminar (evita polling).
- `ignoreRobotsTxt` — **Enterprise only** (Firecrawl respeita robots.txt por padrão).

---

### 2.3 `POST /v1/map` (ou `/v2/map`) — descobrir todas as URLs

Em segundos devolve a **lista de URLs** de um site (via sitemap.xml + descoberta de links). Perfeito como passo 1 de qualquer fluxo.

```bash
curl -X POST "https://api.firecrawl.dev/v2/map" \
  -H "Authorization: Bearer fc-YOUR-API-KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "search": "blog",
    "sitemap": "include",
    "includeSubdomains": true,
    "ignoreQueryParameters": true,
    "limit": 5000
  }'
```

**Resposta:**

```json
{
  "success": true,
  "links": [
    { "url": "https://example.com/", "title": "Home", "description": "..." },
    { "url": "https://example.com/blog", "title": "Blog", "description": "..." }
  ]
}
```

**Parâmetros:**

- `search` — filtra/ordena URLs por relevância a um termo (ex.: `"blog"`).
- `sitemap`: `include` | `skip` | `only`.
- `limit` — máx. de links (até 100.000).
- `ignoreQueryParameters` — remove URLs duplicadas com `?utm_...` etc.

> Dica: `map` é barato e rápido — use sempre antes de `crawl` para saber o tamanho do site e planejar créditos.

---

### 2.4 `POST /v1/extract` (ou `/v2/extract`) — extração estruturada com LLM

Extrai **dados estruturados (JSON)** de uma ou várias páginas usando linguagem natural. Aceita **globs** de URL (ex.: `https://example.com/pricing/*`). Também é assíncrono (job).

```bash
# 1. Iniciar extração
curl -X POST "https://api.firecrawl.dev/v2/extract" \
  -H "Authorization: Bearer fc-YOUR-API-KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": ["https://example.com"],
    "prompt": "Extraia todos os planos de preço: nome, preço mensal, recursos principais",
    "schema": {
      "type": "object",
      "properties": {
        "plans": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "nome": { "type": "string" },
              "preco_mensal": { "type": "number" },
              "recursos": { "type": "array", "items": { "type": "string" } }
            }
          }
        }
      }
    },
    "enableWebSearch": false,
    "showSources": true
  }'

# 2. Consultar o resultado
curl -X GET "https://api.firecrawl.dev/v2/extract/extract_123456789" \
  -H "Authorization: Bearer fc-YOUR-API-KEY"
```

**Resposta final:**

```json
{
  "success": true,
  "status": "completed",
  "data": {
    "plans": [{ "nome": "Free", "preco_mensal": 0, "recursos": ["500 créditos", "1 usuário"] }]
  },
  "sources": ["https://example.com/pricing"]
}
```

**Parâmetros:**

- `urls` — obrigatório; aceita globs (`https://site.com/*`) para varrer o site inteiro.
- `prompt` — o que extrair, em linguagem natural.
- `schema` — JSON Schema opcional que define a estrutura da saída (recomendado para consistência).
- `enableWebSearch: true` — complementa com busca na web (não só as URLs dadas).
- `showSources: true` — inclui as URLs-fonte de cada dado.

> Uso para design system: `extract` com prompt tipo _"extraia a paleta de cores (hex), fontes (nome + família + pesos) e raios de borda usados nos botões"_ → JSON pronto para modelar.

---

### 2.5 Outros endpoints (menção rápida)

- `POST /v1/search` — busca na web e retorna conteúdo completo dos resultados.
- `POST /v2/agent` — agente autônomo: descreve o que precisa e ele navega/coleta sozinho (evolução do extract).
- `POST /v2/interact` — sessão de interação (clicar, digitar, logar) em página já scrapeada.
- `POST /v2/parse` — parse de PDFs/documentos para Markdown.
- `POST /v2/monitor` — monitoramento agendado de mudanças em páginas.

---

## 3. Como usar a API

### URL base e versões

```
https://api.firecrawl.dev
```

- **v1** (estável, mais difundida): `https://api.firecrawl.dev/v1/scrape`, `/v1/crawl`, `/v1/map`, `/v1/extract`, `/v1/search`
- **v2** (atual, recomendada): `https://api.firecrawl.dev/v2/scrape`, `/v2/crawl`, `/v2/map`, `/v2/extract`, `/v2/agent`, `/v2/interact`

### Autenticação

Toda requisição exige o header:

```
Authorization: Bearer fc-YOUR_API_KEY
```

- A chave começa com o prefixo `fc-` (ex.: `fc-123456789`).
- Obtenha em **firecrawl.dev** → dashboard → _API Keys_ (cria conta grátis, sem cartão de crédito).
- **Nunca** commitar a chave em repositório; use variável de ambiente (`FIRECRAWL_API_KEY`).

### SDKs oficiais

```python
# Python
pip install firecrawl-py
from firecrawl import Firecrawl
app = Firecrawl(api_key="fc-YOUR_API_KEY")
result = app.scrape("https://example.com")
crawl = app.crawl("https://example.com", params={"limit": 50})
```

```javascript
// Node.js
import { Firecrawl } from "firecrawl";
const app = new Firecrawl({ apiKey: "fc-YOUR_API_KEY" });
const result = await app.scrape("https://example.com");
```

### CLI oficial

```bash
npx -y firecrawl-cli@latest init --all --browser   # configura chave e browser
firecrawl scrape https://example.com --only-main-content
```

### Códigos de resposta HTTP

| Status | Significado                                              |
| ------ | -------------------------------------------------------- |
| 200    | Sucesso                                                  |
| 400    | Parâmetros incorretos                                    |
| 401    | API key ausente/inválida                                 |
| 402    | Pagamento necessário (créditos esgotados)                |
| 404    | Recurso não encontrado                                   |
| 408    | Timeout (página demorou a carregar; aumente `timeout`)   |
| 429    | **Rate limit excedido** (aguarde e re-tente com backoff) |
| 5xx    | Erro do servidor Firecrawl                               |

Erros comuns no corpo: `SCRAPE_TIMEOUT`, `SCRAPE_ALL_ENGINES_FAILED`, `SCRAPE_SSL_ERROR` (use `skipTlsVerification: true`), `SCRAPE_ANTIBOT_ERROR`.

### Créditos e planos (ago/2026)

| Plano    | Preço        | Créditos/mês | Observações            |
| -------- | ------------ | ------------ | ---------------------- |
| **Free** | R$ 0         | 500–1.000    | 10 req/min; sem cartão |
| Hobby    | ~US$ 16/mês  | 3.000–5.000  | 20–50 req/min          |
| Standard | ~US$ 83/mês  | 100.000      | 100–200 req/min        |
| Growth   | ~US$ 333/mês | 500.000      | 1.000 req/min          |

- Regra geral de custo: **scrape básico = 1 crédito**, **crawl = ~1 crédito/página**, **extract = 5 créditos**, **proxy enhanced = até 5 créditos**.
- Um site de 500 páginas = ~3.500 créditos com crawl+extract → **estoura o plano grátis**; planeje com `map` antes.
- **Firecrawl é open source**: dá para self-hostar via Docker (`ghcr.io/firecrawl/firecrawl`) sem custo por página — porém sem os proxies anti-bot e com setup complexo.

---

## 4. Alternativas gratuitas / open-source (e quando usar cada uma)

| Ferramenta                  | Tipo                        | Custo                         | Renderiza JS?           | Ideal para                                                                    |
| --------------------------- | --------------------------- | ----------------------------- | ----------------------- | ----------------------------------------------------------------------------- |
| **Firecrawl** (nuvem)       | API gerenciada              | Grátis 500–1.000 créditos/mês | ✅ Sim                  | Não-dev / agente de IA querendo Markdown/JSON pronto                          |
| **Firecrawl** (self-hosted) | Docker/AGPL                 | Grátis (infra sua)            | ✅ Sim                  | Volume alto sem pagar por página                                              |
| **Crawl4AI**                | Lib Python (Apache 2.0)     | Grátis                        | ✅ Sim (Playwright)     | Devs que querem Markdown estilo Firecrawl sem API paga; MCP server disponível |
| **wget --mirror**           | CLI (Linux/macOS/Git Bash)  | Grátis                        | ❌ Não                  | Sites **estáticos** simples; download rápido de HTML/CSS/JS/imagens           |
| **HTTrack**                 | Programa com GUI (Windows)  | Grátis (GPL)                  | ❌ Não                  | Não-dev baixando site estático p/ navegar offline                             |
| **SingleFile**              | Extensão de browser + CLI   | Grátis (open source)          | ✅ Sim (no seu browser) | Salvar **1 página** completa (CSS/JS/imagens embutidos) num único .html       |
| **Playwright**              | Lib Node/Python (Microsoft) | Grátis                        | ✅ Sim                  | SPA/React, interações, screenshots, controle fino; base de todas as outras    |

### 4.1 Crawl4AI — o "Firecrawl open source" em Python

```bash
pip install crawl4ai
crawl4ai-setup          # instala Playwright + Chromium
```

```python
import asyncio
from crawl4ai import AsyncWebCrawler

async def main():
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url="https://example.com")
        print(result.markdown.raw_markdown[:500])  # Markdown limpo

asyncio.run(main())
```

- **Quando usar**: você tem Python, quer Markdown LLM-ready sem pagar por página, e aceita gerenciar infra. Também tem **MCP server** (`mcp-server-crawl4ai`) para integrar em agentes (Cursor, Claude Code, Hermes).

### 4.2 wget --mirror — o clássico para site estático

```bash
# Comando "one-liner" para baixar o site inteiro (HTML+CSS+JS+imagens+fontes)
wget --mirror --convert-links --adjust-extension \
     --page-requisites --span-hosts --restrict-file-names=windows \
     --domains example.com --no-parent -P /c/Users/voce/site-baixado \
     https://example.com
```

Explicação das flags:

- `--mirror` — recursivo, infinito, com timestamping.
- `--page-requisites` — baixa também CSS, JS, imagens, fontes de cada página.
- `--convert-links` — reescreve links para funcionarem offline.
- `--span-hosts` — permite baixar assets de CDNs externos.
- `--no-parent` — não sobe para diretórios acima da raiz.
- `--restrict-file-names=windows` — nomes de arquivo compatíveis com Windows.

- **Quando usar**: site simples/estático (ex.: landing pages sem JS pesado). Rápido, grátis, sem chave. **Não funciona** em SPA (o HTML vem vazio) nem em sites com Cloudflare.

### 4.3 HTTrack — para não-dev, com interface gráfica

- Baixe em **httrack.com** (WinHTTrack para Windows).
- Preencha: URL do site → pasta de destino → "Next" → ele copia o site inteiro e **reescreve os links para navegação offline**.
- **Quando usar**: você (não-dev) quer um _espelho_ navegável do site no seu PC, sem terminal. Mesma limitação de JS/anti-bot do wget.

### 4.4 SingleFile — página única, perfeita

- Extensão para Chrome/Edge/Firefox/Safari ou CLI (`single-file` no GitHub: gildas-lormeau/SingleFile).
- Salva **toda a página** (HTML + CSS + JS + imagens + fontes embutidos em base64) em **um único arquivo .html** que abre offline em qualquer browser.
- **Quando usar**: você quer guardar/analisar **uma página específica** (ex.: a home de um site bonito) com fidelidade total — é o método mais simples para "baixar um design" e abrir no editor.

### 4.5 Playwright — a base de tudo, com controle total

```python
# Exemplo: renderizar uma página e salvar HTML + screenshot
pip install playwright && playwright install chromium
```

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://example.com", wait_until="networkidle")
    page.screenshot(path="home.png", full_page=True)
    html = page.content()          # HTML já renderizado (JS executado)
    with open("home.html", "w", encoding="utf-8") as f:
        f.write(html)
    browser.close()
```

- **Quando usar**: SPA/React (o HTML só existe depois do JS rodar), precisar de interação (login, scroll infinito), screenshots full-page, ou como motor para montar seu próprio scraper. É o que o Firecrawl e o Crawl4AI usam por baixo.

### 4.6 Complementos que já existem no Hermes (bônus)

- **Bright Data MCP** (já configurado): `scrape_as_markdown` / `scrape_as_html`, scraping browser com sessão, datasets. Bom para sites difíceis/anti-bot.
- **Jina MCP**: `jina_reader` — basta `https://r.jina.ai/<URL>` para converter qualquer página em Markdown, grátis, sem chave. Ótimo fallback simples.
- **Regra prática**: página única rápida → Jina/SingleFile; site estático inteiro → wget/HTTrack; site moderno inteiro → Firecrawl ou Crawl4AI; anti-bot pesado → Firecrawl `proxy: enhanced` ou Bright Data.

---

## 5. Fluxo passo-a-passo: "baixar um site inteiro" (código + design system)

Objetivo do usuário: pegar o site (HTML/CSS/JS, camadas) e extrair o **design system** (cores, fontes, espaçamentos) para modelar/copiar o design.

### Fase 0 — Preparação

1. Confirme que tem direito de usar o site (termos de uso, copyright). Uso para estudo pessoal é mais tranquilo; redistribuir, não.
2. Defina a chave: `export FIRECRAWL_API_KEY="fc-..."` (ou use fallback gratuito da seção 4).
3. Decida a estratégia conforme o tipo de site:
   - Estático → wget/HTTrack (grátis, rápido).
   - SPA/React moderno → Firecrawl/Crawl4AI/Playwright (obrigatório JS).

### Fase 1 — Mapear o site (Firecrawl `map`)

```bash
curl -s -X POST "https://api.firecrawl.dev/v2/map" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://exemplo.com.br", "limit": 1000}' \
  | jq -r '.links[].url' > urls.txt
```

→ Você descobre quantas páginas existem e estima os créditos (1 página ≈ 1 crédito).

### Fase 2 — Baixar o conteúdo (crawl com HTML + Markdown + screenshot)

```bash
curl -s -X POST "https://api.firecrawl.dev/v2/crawl" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://exemplo.com.br",
    "limit": 200,
    "scrapeOptions": {
      "formats": ["markdown", "html", "rawHtml", "screenshot"],
      "onlyMainContent": false
    }
  }'
```

→ Guarde o `id` do job e faça polling no `GET /v2/crawl/{id}` até `status: "completed"`. Salve cada página como `pasta/pagina.md` + `pasta/pagina.html` + `pasta/pagina.png`.

> Alternativa sem API: `wget --mirror ...` (seção 4.2) já baixa HTML/CSS/JS/imagens na estrutura de pastas original — bom para análise de código.

### Fase 3 — Baixar os assets (CSS, JS, imagens, fontes)

- Se usou wget com `--page-requisites --span-hosts`, os assets já vieram.
- Se usou Firecrawl: o `rawHtml` tem os links; baixe os assets com:

```bash
# extrai URLs de css/js/img do HTML e baixa com wget/curl
grep -oE 'https?://[^"'"'"' ]+\.(css|js|png|jpg|svg|woff2?)' pagina.html | sort -u | xargs -I{} wget -P assets/ {}
```

- **Fontes**: procure por `@font-face` nos CSS e `fonts.googleapis.com` / `fonts.gstatic.com` / `use.typekit.net` nos HTML — baixe os `.woff2` (são os arquivos de fonte reais).

### Fase 4 — Extrair o design system (cores e fontes)

Opção A — **Firecrawl extract (JSON estruturado)**:

```bash
curl -s -X POST "https://api.firecrawl.dev/v2/extract" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": ["https://exemplo.com.br"],
    "prompt": "Extraia o design system: paleta de cores com nome e hex, famílias tipográficas com pesos e tamanhos, raios de borda, espaçamentos e sombras usados nos botões e cards",
    "schema": {
      "type": "object",
      "properties": {
        "cores": { "type": "array", "items": { "type": "object", "properties": { "nome": {"type":"string"}, "hex": {"type":"string"} } } },
        "fontes": { "type": "array", "items": { "type": "object", "properties": { "familia": {"type":"string"}, "pesos": {"type":"array","items":{"type":"number"}} } } }
      }
    }
  }'
```

Opção B — **extração manual dos CSS baixados** (sem custo):

```bash
# cores: todos os hex/rgb usados
grep -ohE '#[0-9a-fA-F]{3,8}|rgb\([^)]*\)|hsl\([^)]*\)' assets/*.css | sort | uniq -c | sort -rn
# fontes: famílias declaradas
grep -ohE 'font-family:[^;]+' assets/*.css | sort -u
# tokens de design (se o site usa Tailwind/CSS vars)
grep -oE '--[a-z-]+:[^;]+' assets/*.css | sort -u
```

### Fase 5 — Organizar em camadas (estrutura final)

```
site-baixado/
├── 01-html/          # páginas .html (renderizadas) + .md (conteúdo limpo)
├── 02-css/           # folhas de estilo (com @font-face, vars, tokens)
├── 03-js/            # scripts (bundle minificado do framework)
├── 04-assets/        # imagens, ícones, fontes .woff2
├── 05-screenshots/   # print full-page de cada página (referência visual)
└── design-system.json # cores, fontes, espaçamentos extraídos (Fase 4)
```

Essa estrutura permite: (a) modelar/copiar o design visual pelas screenshots + design-system.json; (b) estudar o código por camada; (c) recriar em React/Tailwind com as cores e fontes exatas.

---

## 6. Pitfalls (armadilhas e como evitar)

### 6.1 Sites SPA/React precisam de renderização JS ⚠️ (o mais importante)

- Next.js, Vite, React, Vue, Angular: o HTML servido é só um "esqueleto" (`<div id="root">`); o conteúdo real só existe depois do JavaScript rodar.
- **wget e HTTrack baixam o esqueleto vazio** — inútil para esses sites.
- Solução: Firecrawl (renderiza por padrão), Crawl4AI ou Playwright. Se notar Markdown/HTML "vazio", é isso.
- Em Firecrawl, aumente `waitFor` (ex.: 2000–5000 ms) para dar tempo ao JS; use `actions` para _infinite scroll_ (ex.: `{"type":"scroll","direction":"down"}` várias vezes).

### 6.2 Rate limits (HTTP 429)

- Firecrawl: plano Free = ~10 req/min e poucos concorrentes; estourou → 429.
- Solução: respeitar os limites do plano; em `crawl`, usar `delay` (ex.: `"delay": 2` = 2s entre páginas); implementar retry com backoff exponencial (1s → 2s → 4s...); se for site alvo, não bombardeie — sites pequenos derrubam.
- O site alvo também tem rate limit próprio — delays ajudam a não ser bloqueado.

### 6.3 Sites protegidos por Cloudflare / anti-bot

- Cloudflare Challenge, DataDome, PerimeterX etc. podem devolver página de desafio ou 403.
- Solução: Firecrawl `"proxy": "enhanced"` (ou `auto`, que re-tenta sozinho — custa até 5 créditos); Bright Data (MCP já no Hermes) é especialista nisso; como último recurso, renderização manual via browser com perfil (cookies).
- Sintomas: título da página = "Just a moment...", conteúdo com "cf-challenge".

### 6.4 Créditos acabam rápido em crawls grandes

- 500 páginas ≈ 500+ créditos (1/página) → plano grátis estoura em 1 site médio.
- Solução: sempre `map` antes; filtrar com `includePaths`/`excludePaths` (ex.: excluir `/blog/*` se só quer o design); baixar assets com wget em vez de scrapear tudo; usar Crawl4AI self-hosted para volume.

### 6.5 O que você recebe NÃO é o código-fonte original

- Firecrawl devolve o **HTML renderizado** (pós-JS), não o código React original; os JS vêm **minificados**.
- Para "cópia de design" isso basta (cores/fontes/layout estão no CSS e screenshots). Para código-fonte real, só se o site tiver sourcemaps ou for estático (aí wget resolve).
- Chunks de JS podem vir de CDNs (`_next/static`, `cdn.jsdelivr.net`) — baixe com `--span-hosts` ou extraia as URLs.

### 6.6 robots.txt e legalidade

- Firecrawl **respeita robots.txt** por padrão (`ignoreRobotsTxt` é Enterprise only) — páginas bloqueadas no robots não serão crawleadas.
- Respeite termos de uso e copyright; não redistribua conteúdo de terceiros; cuidado com dados pessoais (use `redactPII: true` se necessário).

### 6.7 Outros

- **PDFs** dentro do site: use `"parsers": ["pdf"]` no scrape.
- **Geo/língua**: `location: {country: "BR", languages: ["pt-BR"]}` se o site varia por país.
- **Cache**: `storeInCache: true` (padrão) acelera re-scrapes e economiza créditos; use `maxAge` para controlar frescor.
- **Imagens base64** gigantes no Markdown: `removeBase64Images: true` (padrão).
- **Windows paths**: ao usar wget no Git Bash, use `-P /c/Users/...` (MSYS) e `--restrict-file-names=windows`.

---

## Checklist rápido de decisão

1. **É 1 página só?** → SingleFile (extensão) ou Jina Reader (`https://r.jina.ai/URL`).
2. **É site estático inteiro?** → `wget --mirror` (terminal) ou HTTrack (GUI).
3. **É site moderno (React/SPA) e quero conteúdo p/ IA?** → Firecrawl `crawl` (nuvem) ou Crawl4AI (grátis).
4. **Quero o design system (cores/fontes)?** → Firecrawl `extract` com schema, ou grep nos CSS baixados.
5. **Está atrás de Cloudflare?** → Firecrawl `proxy: enhanced` ou Bright Data MCP.
6. **Volume gigante sem pagar?** → Crawl4AI / Playwright self-hosted.

```

```
