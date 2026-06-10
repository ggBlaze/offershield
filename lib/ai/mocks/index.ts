import type { AnalysisPayload } from "../schema";
import type { Locale } from "@/lib/i18n";
import { MOCK_EN } from "./en";
import { MOCK_ES } from "./es";
import { MOCK_ZH } from "./zh";

/**
 * High-fidelity canned responses, one per supported locale.
 *
 * Returned by analyzeDocument() when no AI_API_KEY is configured. Each
 * one is a complete translation of the same scenario (the freelance
 * contract sample) so the demo experience looks identical regardless
 * of the user's chosen language.
 *
 * Field keys and enum literals stay in English (low/medium/high,
 * you/counterparty/mutual); only the natural-language content is
 * localized. This matches the schema and the live-mode prompt.
 */

const MOCKS: Record<Locale, AnalysisPayload> = {
  en: MOCK_EN,
  es: MOCK_ES,
  zh: MOCK_ZH,
};

export function getMockAnalysis(locale: Locale = "en"): AnalysisPayload {
  return MOCKS[locale] ?? MOCKS.en;
}
