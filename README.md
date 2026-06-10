<div align="center">

# OfferShield

### Understand contracts before you sign.

**Plain-English explanations of contracts, offer letters, NDAs, and more — powered by [MiniMax-M3](https://MiniMax.io).**

[Live demo](#-quick-start) · [Features](#-features) · [Deploy on Vercel](#-deploy) · [API reference](#-api)

</div>

---

## 🛡 What is OfferShield?

OfferShield is a web app that turns dense legal text into a calm, structured report anyone can read. Paste a contract or upload a PDF, click **Analyze**, and get a plain-English walkthrough, color-coded risk flags, key dates, obligations, ambiguous phrases, and a copyable list of questions to ask before signing.

It's built for the moment before you sign — not for the lawyer who already has the document in their head.

> **OfferShield provides educational information, not legal advice. Consult a qualified lawyer for legal decisions.**

---

## ⚡ Powered by MiniMax-M3

OfferShield runs on **MiniMax-M3**, MiniMax's flagship model, accessed through MiniMax's Anthropic-compatible endpoint. Every analysis request is routed through a secure server-side route — your document text is used only to generate your report, and your API key (if configured) never leaves the server.

The AI layer is provider-configurable through three environment variables:

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

### Vercel (recommended)

1. Push the repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js. No build settings to change.
4. Set environment variables in the Vercel dashboard:
   - `AI_API_KEY` — your MiniMax-M3 key
   - `AI_BASE_URL` — defaults correctly
   - `AI_MODEL` — defaults to `MiniMax-M3`
   > ⚠️ Apply to **Production**, not just Preview, or the live URL will hit the mock.
5. Click **Deploy**. Live in ~60 seconds.

### Vercel CLI

```bash
npm i -g vercel
vercel
vercel env add AI_API_KEY   production
vercel env add AI_BASE_URL  production
vercel env add AI_MODEL     production
vercel --prod
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
curl -X POST https://offershield.app/api/analyze \
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
