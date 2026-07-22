# lance-fit-checker — Worker backend

Serverless backend for the JD Fit Checker (`/fit.html`). Holds the DeepSeek key
server-side, scores JD↔CV coverage deterministically, and calls DeepSeek
(`deepseek-chat`, OpenAI-compatible) in JSON mode (`response_format`), with output
constrained to — and validated against — the verified experience bank.
Two OpenAI-compatible providers are supported: Kimi K3 (`kimi-k3`, stronger
reasoning, higher cost) and DeepSeek V3 (`deepseek-chat`, cheap). With both keys
set, Kimi is primary and DeepSeek the fallback (force the order with the
`LLM_PRIMARY` var); each provider gets one retry on transient failures before
falling through. Identical JDs are served from a KV result cache (7d TTL, no
model call, no quota spent); upstream calls time out (50s DeepSeek / 90s Kimi,
K3 is a reasoning model), and rate-limit quota is only consumed by successful
generations.

- Source of truth: `../data/experience-bank.json` (bundled in at build).
- The browser never sees the key. CORS is locked to `lance-song.com`.

## One-time deploy

```bash
cd worker
npm install
npx wrangler login

# 1. Rate-limit store (bounds worst-case spend)
npx wrangler kv namespace create RATELIMIT
#   → paste the printed id into wrangler.toml and uncomment the [[kv_namespaces]] block

# 2. API keys as secrets (never commit them) — either or both providers
npx wrangler secret put DEEPSEEK_API_KEY   # platform.deepseek.com
npx wrangler secret put KIMI_API_KEY       # platform.moonshot.ai — optional; primary when set

# 3. Ship it
npm run deploy
#   → note the printed URL, e.g. https://lance-fit-checker.<your-subdomain>.workers.dev
```

Then wire the frontend: set `DEFAULT_WORKER_URL` in `../fit.html` to that URL, and
commit + push the site.

**Set a spend cap / limited top-up** on the key at platform.deepseek.com — the rate
limits here bound volume, but a balance cap is the real backstop.

## Local development

```bash
npm run dev          # wrangler dev on http://localhost:8787
# then open the frontend pointed at it (no deploy, no CORS hassle):
#   file://…/fit.html?api=http://localhost:8787
```

For a live LLM run locally, put the keys in `worker/.dev.vars` (gitignored):
```
DEEPSEEK_API_KEY=sk-...
KIMI_API_KEY=sk-...     # optional; when present, Kimi K3 is primary locally too
```
Without a key, `wrangler dev` still serves and validates; generation returns 500.
Without the KV namespace bound, rate limiting is skipped (fine for local).

## Tests

```bash
npm test             # deterministic scorer unit tests (node --test, no network)
```

## Tunables (`src/index.js`)

| Const | Default | Meaning |
|-------|---------|---------|
| `PER_IP_DAILY` | 25 | generations per visitor IP per day (shared NATs share an IP) |
| `GLOBAL_DAILY` | 300 | hard ceiling on total generations per day |
| `JD_MAX` | 8000 | max JD chars accepted |
| `MAX_TOKENS` | 8000 | max output tokens (analysis + a full reworded CV is large) |
| Providers | Kimi K3 → DeepSeek | both OpenAI-compatible JSON mode; order via `LLM_PRIMARY` var, Kimi model via `KIMI_MODEL` |
| `CACHE_TTL` | 604800 | KV result-cache TTL for identical JDs (7 days) |
| `DEEPSEEK_TIMEOUT_MS` | 50000 | upstream timeout for DeepSeek; one retry on transient failures |
| `KIMI_TIMEOUT_MS` | 90000 | upstream timeout for Kimi K3 (reasoning model, slower) |

## Guarantees

- **No fabrication:** every returned match must cite a real bank bullet id; others are
  dropped server-side (`sanitize`). The fit score comes from the deterministic scorer,
  never the model.
- **Injection-resistant:** the JD is passed as untrusted data; the system prompt forbids
  following instructions inside it; output is JSON mode, shape-validated by `sanitize`.
