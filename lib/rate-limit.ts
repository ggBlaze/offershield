/**
 * A tiny in-memory token bucket for the demo.
 *
 * Not durable across serverless cold starts — but it does prevent
 * accidental double-clicks from burning 2x tokens. Good enough for MVP.
 *
 * Usage:
 *   if (!takeToken(ip)) return new Response("rate_limited", { status: 429 });
 */

const buckets = new Map<string, { tokens: number; last: number }>();

const CAPACITY = 10; // 10 requests
const REFILL_MS = 60_000; // per minute

export function takeToken(key: string): boolean {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: CAPACITY, last: now };
  const elapsed = now - b.last;
  if (elapsed > REFILL_MS) {
    b.tokens = CAPACITY;
    b.last = now;
  }
  if (b.tokens <= 0) {
    buckets.set(key, b);
    return false;
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return true;
}

export function clientKeyFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "anon";
  const real = headers.get("x-real-ip");
  if (real) return real;
  return "anon";
}
