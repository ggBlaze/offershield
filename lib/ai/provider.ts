import "server-only";
import { config } from "@/lib/env";

/**
 * Raw fetch against an Anthropic-compatible messages endpoint.
 *
 * Why raw fetch instead of the @anthropic-ai/sdk:
 *   - Avoids the SDK defaulting to api.anthropic.com and any first-party
 *     headers/flows that third-party proxies may reject.
 *   - Keeps the dep tree lean and the swap path obvious.
 *
 * Compatible with:
 *   - MiniMax-M3 at https://api.minimax.io/anthropic
 *   - Anthropic directly at https://api.anthropic.com
 *   - Any drop-in Anthropic-compatible proxy
 */

const ANTHROPIC_VERSION = "2023-06-01";

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

interface MessagesResponse {
  content?: { type: string; text?: string }[];
  error?: { type?: string; message?: string };
}

interface CallOptions {
  system: string;
  user: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/** Make a single messages call and return the assistant text. */
export async function callClaude(opts: CallOptions): Promise<string> {
  const model = opts.model ?? config.model;
  const url = `${config.baseUrl}/v1/messages`;

  const body = {
    model,
    // 4096 covers the full 14-section schema comfortably for any
    // contract size, including 15k-word documents and Spanish /
    // Chinese responses which run ~15% longer than English. The
    // 60s route maxDuration + 90s fetch timeout are sized to
    // absorb the longer generation time.
    max_tokens: opts.maxTokens ?? 4096,
    temperature: opts.temperature ?? 0.2,
    system: opts.system,
    messages: [{ role: "user", content: opts.user }],
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": config.apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify(body),
      // Give the model up to 90s — MiniMax-M3 is occasionally slow
      // on the first request after idle, and the structured 14-
      // section response can run long. The route's maxDuration is
      // the user-visible cap; this is the hard network cap.
      signal: AbortSignal.timeout(90_000),
    });
  } catch (err) {
    throw new ProviderError(
      `Network error calling ${url}: ${(err as Error).message}`,
      502,
      err,
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ProviderError(
      `Provider returned ${res.status}: ${text.slice(0, 500)}`,
      res.status,
    );
  }

  const data = (await res.json()) as MessagesResponse;
  if (data.error) {
    throw new ProviderError(
      data.error.message ?? "Provider returned an error",
      502,
    );
  }

  const text = data.content
    ?.filter((c) => c.type === "text" && typeof c.text === "string")
    .map((c) => c.text!)
    .join("\n")
    .trim();

  if (!text) {
    throw new ProviderError(
      "Provider response did not include any text content",
      502,
    );
  }

  return text;
}

/** Health snapshot for /api/health. */
export function getHealth() {
  return {
    ok: true,
    model: config.model,
    hasKey: config.apiKey.length > 0,
    mockMode: config.mockMode,
  };
}
