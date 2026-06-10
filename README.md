<div align="center">

# OfferShield

### Understand contracts before you sign.

**Plain-English explanations of contracts, offer letters, NDAs, and more — powered by [MiniMax-M3](https://MiniMax.io).**

[Live demo](#-quick-start) · [Features](#-features) · [Deploy](#-deploy) · [API reference](#-api)

Deploys to **Vercel**, **Coolify**, **Render**, **Fly.io**, or any Docker host.

</div>

---

<img width="1425" height="1621" alt="Screenshot_20260610_044602" src="https://github.com/user-attachments/assets/18fc1c9e-d042-48e5-9a86-757a42877698" />


## 🛡 What is OfferShield?

OfferShield is a web app that turns dense legal text into a calm, structured report anyone can read. Paste a contract or upload a PDF, click **Analyze**, and get a plain-English walkthrough, color-coded risk flags, key dates, obligations, ambiguous phrases, and a copyable list of questions to ask before signing.

It's built for the moment before you sign — not for the lawyer who already has the document in their head.

> **OfferShield provides educational information, not legal advice. Consult a qualified lawyer for legal decisions.**

---

## ⚡ Powered by MiniMax-M3

OfferShield runs on **MiniMax-M3**, MiniMax's flagship model, accessed through MiniMax's Anthropic-compatible endpoint. Every analysis request is routed through a secure server-side route — your document text is used only to generate your report, and your API key (if configured) never leaves the server.

### Why MiniMax-M3

We evaluated several frontier models for OfferShield. MiniMax-M3
won on four specific dimensions that mattered for a contract
explainer:

1. **Long-context fluency.** Contracts, NDAs, and offer letters
   routinely run 5,000–15,000 words. MiniMax-M3 keeps the entire
   document in working memory, so a clause in section 14 can still
   be cross-referenced against definitions in section 1 when the
   model writes the plain-English explanation. Most competitors
   start forgetting the beginning of the document at this length.

2. **Strict structured output.** OfferShield renders a 14-section
   report (risk score, key clauses, red flags, obligations,
   questions, negotiation opportunities, …) from a single JSON
   object. MiniMax-M3's instruction following makes the
   "return ONLY this JSON, no prose" workflow reliably clean — our
   retry-on-parse-failure path almost never fires. That means
   lower latency, lower cost, and fewer hallucinations in the UI.

3. **Native multilingual output.** The same model produces the same
   quality of plain-language analysis in English, Spanish, and
   Simplified Chinese — and any other language you set as
   `AI_MODEL` returns. A single deployment serves a truly global
   audience without per-locale prompt gymnastics.

4. **Sub-second time-to-first-token.** When judges are clicking
   through the app live at a contest, "Analyzing…" for eight
   seconds kills the demo. MiniMax-M3 typically streams the first
   analysis section in under a second, so the report feels
   instant.

The AI layer is provider-configurable through three environment
variables, so the same code can talk to Anthropic, OpenRouter, or
any other Anthropic-compatible proxy with two env-var swaps:

| Variable       | Default                                  | Description                              |
|----------------|------------------------------------------|------------------------------------------|
| `AI_API_KEY`   | _(empty)_                                | Your provider key. Empty = mock mode.    |
| `AI_BASE_URL`  | `https://api.minimax.io/anthropic`       | Any Anthropic-compatible endpoint.        |
| `AI_MODEL`     | `MiniMax-M3`                             | Model name. Defaults to MiniMax-M3.       |

**Swap to Anthropic, OpenRouter, or any compatible proxy with two env vars — no code changes.**

---

## ✨ Features

- **Plain-English explanations** — calm walkthroughs of what a document actually does
- **Color-coded risk flags** — low / medium / high severity for every concern
- **Risk score** — a heuristic 0–100 score with a one-line explanation
- **Key clauses** — the terms that actually matter, demystified
- **Obligations by party** — clearly split into "you", "the other side", and "mutual"
- **Payment & termination** — money, schedule, notice, and renewal in one place
- **Deadlines & important dates** — pulled out so nothing gets missed
- **Missing protections** — what a reasonable contract of this type should have but doesn't
- **Ambiguous language** — specific quoted phrases flagged with why they're unclear
- **Smart questions to ask** — copyable list, one click
- **Negotiation opportunities** — concrete things to push back on
- **PDF upload** — drag-and-drop or click; up to 4.5 MB
- **Three built-in samples** — freelance contract, offer letter, NDA — instantly testable
- **Private by default** — your text is used only to generate the report; nothing is stored
- **No login, no account, no friction** — open the app and use it

---

## 🚀 Quick start

```bash
# 1. Install dependencies
npm install        # or: pnpm install / yarn install

# 2. (Optional) configure a real MiniMax-M3 key
cp .env.example .env.local
# → set AI_API_KEY to your MiniMax key (sk-cp-…)
# → AI_BASE_URL and AI_MODEL already default to MiniMax-M3

# 3. Run the dev server
npm run dev
# → http://localhost:3000
```

**No `AI_API_KEY`?** OfferShield runs in **mock mode** and returns a high-fidelity canned analysis on every request, so the app is instantly demoable with zero setup. Add a key whenever you're ready to analyze real documents.

### Local troubleshooting

If you see a `Server Error: Cannot find module './NNN.js'` after
switching between `next dev` and `next build`, the dev server's
webpack cache got mixed with the production build. The fix is one
command:

```bash
rm -rf .next && npm run dev
```

This is a known Next.js dev-mode gotcha — running `next build` while
`next dev` is alive (or just after, if `.next/` is already populated)
corrupts the chunk filenames the dev server is looking for. It does
not affect production deployments, which always build into a fresh
image.

---

## 🧱 Stack

- **[Next.js 14](https://nextjs.org)** — App Router, TypeScript strict
- **[Tailwind CSS](https://tailwindcss.com)** — dark, premium design system
- **shadcn/ui-style components** — hand-written primitives, no CLI step
- **[MiniMax-M3](https://MiniMax.io)** via the Anthropic-compatible messages API
- **[unpdf](https://github.com/unjs/unpdf)** — server-side PDF text extraction
- **[zod](https://zod.dev)** — request and response validation
- **[lucide-react](https://lucide.dev)** — icons
- Deploy target: **[Vercel](https://vercel.com)**

No database, no auth, no state-management library. Just a fast, polished, deployable web app.

---

## 🌐 Deploy

You can deploy OfferShield.pro on **Vercel** (zero-config) or on
**any Docker-compatible host** (Coolify, Render, Fly.io, your own VPS)
using the included `Dockerfile`. Both paths give you a production
build with the same behavior.

### Vercel (fastest path)

1. Push the repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js. No build settings to change.
4. Set environment variables in the Vercel dashboard:
   - `AI_API_KEY` — your MiniMax-M3 key
   - `AI_BASE_URL` — defaults correctly
   - `AI_MODEL` — defaults to `MiniMax-M3`
   > ⚠️ Apply to **Production**, not just Preview, or the live URL will hit the mock.
5. Click **Deploy**. Live in ~60 seconds.

### Coolify (self-hosted)

Coolify is a great fit for OfferShield.pro — you keep full control of
the server, the data, and the deployment, with no per-request or
per-build fees. The repo ships with a multi-stage `Dockerfile` and a
reference `docker-compose.yml` for this exact use case.

**On the server, once:**

```bash
# Install Coolify (Ubuntu / Debian) — see https://coolify.io/docs/installation
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

**In the Coolify dashboard:**

1. **Project** → New → **Application** → **Public/Private Repository**
   (or **GitHub App** for auto-deploys on push).
2. Point it at this repository (`blaze/offershield` or your fork).
3. **Build Pack**: choose **Dockerfile**. Coolify auto-detects the
   `Dockerfile` in the repo root.
4. **Port**: `3000`
5. **Healthcheck Path**: `/api/health`
6. **Environment Variables** (Production scope):
   - `AI_API_KEY` — your MiniMax-M3 key
   - `AI_BASE_URL` — defaults to `https://api.minimax.io/anthropic`
   - `AI_MODEL` — defaults to `MiniMax-M3`
7. **Domains**: add `offershield.pro` and (optionally) `www.offershield.pro`,
   then point the DNS at your Coolify server as instructed by the
   dashboard.
8. **Deploy**. The first build pulls `node:20-alpine`, runs `npm ci`
   + `npm run build`, and ships a ~150 MB image with the Next.js
   standalone server.

Coolify will auto-restart on crash, run the health check every 30
seconds, and you can roll back to any previous deployment from the
dashboard.

> **Why the standalone build?** With `output: "standalone"` in
> `next.config.mjs`, Next.js produces a self-contained server bundle
> in `.next/standalone` that the `Dockerfile` copies directly. The
> resulting image is roughly 3× smaller than the default
> `node:20-alpine` + full `node_modules` build.

### Plain Docker (no Coolify)

If you'd rather not use Coolify:

```bash
docker build -t offershield .
docker run -d --name offershield -p 3000:3000 \
  -e AI_API_KEY=sk-cp-... \
  -e AI_BASE_URL=https://api.minimax.io/anthropic \
  -e AI_MODEL=MiniMax-M3 \
  --restart unless-stopped \
  offershield
```

Or use the included `docker-compose.yml`:

```bash
AI_API_KEY=sk-cp-... docker compose up -d
```

---

## 📡 API

| Method | Path             | Description                                                       |
|--------|------------------|-------------------------------------------------------------------|
| `POST` | `/api/analyze`   | Body: `{ text, source }`. Returns `{ result: AnalysisPayload }`.  |
| `POST` | `/api/parse-pdf` | Multipart upload of a PDF (≤ 4.5 MB). Returns `{ text, pageCount }`. |
| `GET`  | `/api/health`    | `{ ok, model, hasKey, mockMode, timestamp }` — live-debug.         |

### Example

```bash
curl -X POST https://offershield.pro/api/analyze \
  -H "content-type: application/json" \
  -d '{ "text": "...your document...", "source": "paste" }'
```

---

## 📁 Project structure

```
app/
  layout.tsx, page.tsx, globals.css
  loading.tsx, error.tsx, not-found.tsx
  opengraph-image.tsx, robots.ts, sitemap.ts
  api/
    analyze/route.ts
    parse-pdf/route.ts
    health/route.ts
components/
  ui/                  # shadcn-style primitives
  layout/              # Header, Footer
  sections/            # Hero, HowItWorks, Features, Trust, DisclaimerBanner
  analyzer/            # Analyzer, DocumentInput, Report, ...
lib/
  ai/                  # provider, analyze, schema, prompt, mock
  samples/             # 3 built-in sample documents
  pdf.ts, env.ts, utils.ts, rate-limit.ts
types/
  analysis.ts
public/
  favicon.svg
```

---

## 🔒 Privacy

- Your document text is sent to the model **only to generate your report**.
- Nothing is stored on OfferShield's servers.
- The API key (when configured) is server-side only; the browser never sees it.
- No analytics, no tracking, no third-party scripts.
- Every result page carries the disclaimer: **educational, not legal advice**.

---

## ⚖️ Disclaimer

OfferShield is an **educational assistant**, not a law firm and not a lawyer. The analyses it produces are generated by an AI and are intended to help you understand what a document says — not to replace professional legal counsel. For any decision with real consequences, please consult a licensed attorney in your jurisdiction.

The risk score is a **heuristic**, not a probability of enforceability or harm. It is one signal among many; it should never be the only one you rely on.

---

## 📄 License

[MIT](./LICENSE) © Blaze
