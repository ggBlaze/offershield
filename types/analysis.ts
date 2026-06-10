/**
 * Public type re-exports. The full schema lives in lib/ai/schema.ts so
 * the AI layer stays in one place. Components should import from here.
 */
export type {
  AnalysisPayload,
  KeyClause,
  RedFlag,
  Obligations,
  PaymentTerms,
  Termination,
  Deadline,
  AmbiguousPhrase,
  RiskLevel,
  Severity,
  Party,
  Confidence,
} from "@/lib/ai/schema";
