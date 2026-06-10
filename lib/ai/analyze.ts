import "server-only";
import { AnalysisPayload, RiskLevel } from "./schema";
import { MOCK_ANALYSIS } from "./mock";
import { config } from "@/lib/env";
import { callClaude, ProviderError } from "./provider";
import { SYSTEM_PROMPT, buildUserMessage, RETRY_MESSAGE } from "./prompt";

/**
 * Analyze a document and return a structured, validated payload.
 *
 * Behavior:
 *   - mockMode: returns MOCK_ANALYSIS (after a short delay so the UI
 *     loading state is visible)
 *   - live:     POSTs to the configured provider, parses the response
 *               with zod, retries once on parse failure, and throws a
 *               typed error if it still doesn't validate
 */

export class AnalysisParseError extends Error {
  constructor(message: string, public readonly rawText: string) {
    super(message);
    this.name = "AnalysisParseError";
  }
}

export class AnalysisInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnalysisInputError";
  }
}

const MIN_CHARS = 100;
const MAX_CHARS = 25_000;

function assertValidInput(text: string) {
  const trimmed = text.trim();
  if (trimmed.length < MIN_CHARS) {
    throw new AnalysisInputError(
      `Document is too short (${trimmed.length} characters). Please paste at least ${MIN_CHARS} characters.`,
    );
  }
  if (trimmed.length > MAX_CHARS) {
    throw new AnalysisInputError(
      `Document is too long (${trimmed.length.toLocaleString()} characters). Please keep it under ${MAX_CHARS.toLocaleString()} characters.`,
    );
  }
}

function bucketFor(score: number): RiskLevel {
  if (score < 34) return "low";
  if (score < 67) return "medium";
  return "high";
}

/** Try to extract a JSON object from a model response. */
function extractJson(text: string): string {
  // Strip markdown code fences if the model included them anyway.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced && fenced[1]) return fenced[1].trim();

  // Otherwise find the first { and the last }.
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last < first) return text.trim();
  return text.slice(first, last + 1);
}

function parseAndValidate(raw: string): AnalysisPayload {
  const json = extractJson(raw);
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (err) {
    throw new AnalysisParseError(
      "Model response was not valid JSON",
      raw.slice(0, 2_000),
    );
  }
  const result = AnalysisPayload.safeParse(parsed);
  if (!result.success) {
    throw new AnalysisParseError(
      "Model response did not match the required schema",
      raw.slice(0, 2_000),
    );
  }
  const data = result.data;
  // Reconcile riskLevel with riskScore so the badge and number agree.
  const expected = bucketFor(data.riskScore);
  if (data.riskLevel !== expected) {
    data.riskLevel = expected;
  }
  // Drop empty entries from arrays so the UI doesn't render blanks.
  data.keyClauses = data.keyClauses.filter(
    (c) => (c.title ?? "").trim() && (c.explanation ?? "").trim(),
  );
  data.redFlags = data.redFlags.filter(
    (f) => (f.title ?? "").trim() && (f.detail ?? "").trim(),
  );
  data.obligations = data.obligations
    .map((o) => ({ ...o, items: o.items.filter((i) => i.trim()) }))
    .filter((o) => o.items.length > 0);
  data.deadlines = data.deadlines.filter((d) => (d.event ?? "").trim());
  data.ambiguousLanguage = data.ambiguousLanguage.filter(
    (a) => (a.quote ?? "").trim() && (a.whyUnclear ?? "").trim(),
  );
  data.questionsToAsk = data.questionsToAsk.filter((q) => q.trim());
  data.missingProtections = data.missingProtections.filter((m) => m.trim());
  data.negotiationOpportunities = data.negotiationOpportunities.filter((n) =>
    n.trim(),
  );
  return data;
}

interface AnalyzeOptions {
  text: string;
  /** Optional override for the mock — useful for unit tests. */
  forceMock?: boolean;
}

export async function analyzeDocument(
  opts: AnalyzeOptions,
): Promise<AnalysisPayload> {
  assertValidInput(opts.text);

  if (config.mockMode || opts.forceMock) {
    // Small delay so the loading state is visible in the demo.
    await new Promise((r) => setTimeout(r, 700));
    return MOCK_ANALYSIS;
  }

  const user = buildUserMessage(opts.text);

  // First attempt
  let text: string;
  try {
    text = await callClaude({ system: SYSTEM_PROMPT, user });
  } catch (err) {
    if (err instanceof ProviderError) throw err;
    throw new ProviderError(
      `Unexpected provider error: ${(err as Error).message}`,
      502,
      err,
    );
  }

  let payload: AnalysisPayload;
  try {
    payload = parseAndValidate(text);
  } catch (err) {
    if (!(err instanceof AnalysisParseError)) throw err;
    // Single retry: ask the model to return valid JSON only.
    try {
      const retryText = await callClaude({
        system: SYSTEM_PROMPT,
        user: `${user}\n\n${RETRY_MESSAGE}`,
        temperature: 0,
      });
      payload = parseAndValidate(retryText);
    } catch (retryErr) {
      // Surface the original parse error so callers see what came back.
      throw err;
    }
  }

  return payload;
}
