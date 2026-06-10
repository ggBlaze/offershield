import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeDocument, AnalysisInputError, AnalysisParseError } from "@/lib/ai/analyze";
import { clientKeyFromHeaders, takeToken } from "@/lib/rate-limit";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";

export const runtime = "nodejs";
// 60s is the user-visible cap — long enough for MiniMax-M3 to
// finish a 14-section structured response (typical 15-25s, but
// cold starts and longer documents can run higher). Beyond this
// the response is best-effort aborted.
export const maxDuration = 60;

const Body = z.object({
  text: z.string().min(1, "Document text is required."),
  source: z.enum(["paste", "pdf", "sample"]).default("paste"),
  language: z
    .string()
    .optional()
    .transform((v) => (isLocale(v) ? v : DEFAULT_LOCALE)),
  /**
   * Optional user-supplied API key (BYOK). When present, this
   * single request uses the user's key against the configured
   * base URL + model. The key is never logged, never stored on
   * the server, and discarded as soon as the call returns.
   *
   * Validated for shape only (prefix + minimum length). A real
   * validity check would require a probe call against the
   * provider, which we don't do — invalid keys surface as a
   * 401/403 from the provider, surfaced to the user as a
   * friendly error.
   */
  userApiKey: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^(sk-|sk-ant-|sk-cp-)[A-Za-z0-9_-]{16,}$/.test(v.trim()),
      "userApiKey must look like a MiniMax (sk-cp-…) or Anthropic (sk-ant-…) key",
    ),
});

export async function POST(req: Request) {
  const ip = clientKeyFromHeaders(req.headers);
  if (!takeToken(`analyze:${ip}`)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many requests. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  let body: z.infer<typeof Body>;
  try {
    const json = await req.json();
    body = Body.parse(json);
  } catch (err) {
    return NextResponse.json(
      {
        error: "bad_request",
        message: "Invalid request body.",
        details: err instanceof z.ZodError ? err.flatten() : undefined,
      },
      { status: 400 },
    );
  }

  try {
    const payload = await analyzeDocument({
      text: body.text,
      locale: body.language,
      // Empty string from the optional zod field → undefined so the
      // AI layer falls back to the env-configured key.
      userApiKey: body.userApiKey?.trim() || undefined,
    });
    return NextResponse.json({
      result: payload,
      source: body.source,
      language: body.language,
    });
  } catch (err) {
    if (err instanceof AnalysisInputError) {
      return NextResponse.json(
        { error: "invalid_input", message: err.message },
        { status: 400 },
      );
    }
    if (err instanceof AnalysisParseError) {
      // Note: we log the raw text for debugging but never the key.
      console.error("[offershield] parse failed:", err.rawText);
      return NextResponse.json(
        {
          error: "parse_failed",
          message:
            "The model returned a response we couldn't parse. Please try again.",
          retryable: true,
        },
        { status: 502 },
      );
    }
    // Surface the error message for user-supplied key failures so
    // the user can tell "my key is invalid" from "the service is
    // down". We never log the key itself.
    const message =
      err instanceof Error && err.message
        ? err.message
        : "Something went wrong while analyzing your document. Please try again.";
    console.error("[offershield] analyze failed:", err);
    return NextResponse.json(
      {
        error: "analysis_failed",
        message: message.slice(0, 300),
        retryable: true,
      },
      { status: 502 },
    );
  }
}
