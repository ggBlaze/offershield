# syntax=docker/dockerfile:1.7
# ──────────────────────────────────────────────────────────────────────────────
# OfferShield.pro — production Dockerfile
# Multi-stage build using Next.js's `output: "standalone"` for a small image.
# Works on Vercel, Coolify, Render, Fly, any host that runs a container.
# Build context: the repository root.
# ──────────────────────────────────────────────────────────────────────────────

# ── 1. Install dependencies with a clean, reproducible tree ──────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Install only what's needed to fetch packages
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; \
  else npm install --no-audit --no-fund; \
  fi

# ── 2. Build the Next.js standalone bundle ─────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ── 3. Runtime image — only what's needed to serve ─────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as a non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Standalone bundle + the static + public assets that Next still serves
# out of the public dir at runtime
COPY --from=builder --chown=nextjs:nodejs /app/public             ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone   ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static        ./.next/static

USER nextjs
EXPOSE 3000

# Health check — Coolify / any orchestrator can poll this
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
