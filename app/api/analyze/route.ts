import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeDocument, AnalysisInputError, AnalysisParseError } from "@/lib/ai/analyze";
import { clientKeyFromHeaders, takeToken } from "@/lib/rate-limit";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";

export const runtime = "nodejs";
export const maxDuration = 30;

const Body = z.object({
  text: z.string().min(1, "Document text is required."),
  source: z.enum(["paste", "pdf", "sample"]).default("paste"),
  language: z
    .string()
    .optional()
    .transform((v) => (isLocale(v) ? v : DEFAULT_LOCALE)),
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
    console.error("[offershield] analyze failed:", err);
    return NextResponse.json(
      {
        error: "analysis_failed",
        message:
          "Something went wrong while analyzing your document. Please try again.",
        retryable: true,
      },
      { status: 502 },
    );
  }
}
