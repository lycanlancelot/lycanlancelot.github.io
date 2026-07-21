# lance-fit-checker — Worker backend

Serverless backend for the JD Fit Checker (`/fit.html`). Holds the DeepSeek key
server-side, scores JD↔CV coverage deterministically, and calls DeepSeek
(`deepseek-chat`, OpenAI-compatible) in JSON mode (`response_format`), with output
constrained to — and validated against — the verified experience bank.

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

# 2. API key as a secret (never commit it) — get one at platform.deepseek.com
npx wrangler secret put DEEPSEEK_API_KEY

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

For a live LLM run locally, put the key in `worker/.dev.vars` (gitignored):
```
DEEPSEEK_API_KEY=sk-...
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
| `PER_IP_DAILY` | 5 | generations per visitor IP per day |
| `GLOBAL_DAILY` | 200 | hard ceiling on total generations per day |
| `JD_MAX` | 8000 | max JD chars accepted |
| `MAX_TOKENS` | 4000 | max output tokens (full JSON for a rich JD) |
| `MODEL` | `deepseek-chat` | DeepSeek V3, called in JSON mode (`response_format`) |

## Guarantees

- **No fabrication:** every returned match must cite a real bank bullet id; others are
  dropped server-side (`sanitize`). The fit score comes from the deterministic scorer,
  never the model.
- **Injection-resistant:** the JD is passed as untrusted data; the system prompt forbids
  following instructions inside it; output is JSON mode, shape-validated by `sanitize`.
