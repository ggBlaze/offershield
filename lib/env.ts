import "server-only";
import { z } from "zod";

/**
 * Server-only environment reader.
 *
 * OfferShield is designed to be instantly demoable without any
 * configuration: if AI_API_KEY is missing we return `mockMode: true`
 * and the rest of the app substitutes a high-fidelity canned response.
 *
 * The provider is configurable through env vars so the same code can
 * talk to MiniMax-M3 via its Anthropic-compatible endpoint or to any
 * other OpenAI/Anthropic-style service.
 */

const envSchema = z.object({
  AI_API_KEY: z.string().optional().default(""),
  AI_BASE_URL: z
    .string()
    .url()
    .optional()
    .default("https://api.minimax.io/anthropic"),
  AI_MODEL: z.string().optional().default("MiniMax-M3"),
});

const parsed = envSchema.safeParse({
  AI_API_KEY: process.env.AI_API_KEY,
  AI_BASE_URL: process.env.AI_BASE_URL,
  AI_MODEL: process.env.AI_MODEL,
});

if (!parsed.success) {
  // We don't want the app to crash on env misconfig — we fall back to mock.
  // This is logged so a deploy with a malformed URL is still visible.
  console.warn(
    "[offershield] env validation failed; using mock mode. issues:",
    parsed.error.flatten().fieldErrors,
  );
}

const env = parsed.success
  ? parsed.data
  : { AI_API_KEY: "", AI_BASE_URL: "https://api.minimax.io/anthropic", AI_MODEL: "MiniMax-M3" };

export const config = {
  apiKey: env.AI_API_KEY.trim(),
  baseUrl: env.AI_BASE_URL.replace(/\/+$/, ""),
  model: env.AI_MODEL.trim() || "MiniMax-M3",
  mockMode: env.AI_API_KEY.trim().length === 0,
} as const;

export type AppConfig = typeof config;
