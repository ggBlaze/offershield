"use client";

import * as React from "react";
import {
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  ClipboardList,
  Copy,
  FileText,
  Gauge,
  HelpCircle,
  KeyRound,
  Lightbulb,
  MessageSquareWarning,
  Repeat2,
  Scale,
  ShieldCheck,
  Sparkles,
  Wallet,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, formatDate, formatRiskScore, riskClasses } from "@/lib/utils";
import type { AnalysisPayload, RedFlag } from "@/types/analysis";
import { useLocale } from "@/lib/i18n";

/* --------------------------------- hooks --------------------------------- */

function useCopy() {
  const [copied, setCopied] = React.useState(false);
  const copy = React.useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Best effort; ignore.
    }
  }, []);
  return { copied, copy };
}

/* ------------------------------ Risk Score card --------------------------- */

function RiskScoreCard({ payload }: { payload: AnalysisPayload }) {
  const { t, locale } = useLocale();
  const c = riskClasses(payload.riskLevel);
  return (
    <Card className="md:col-span-1 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardDescription className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5" />
            {t.report.risk.tag}
          </CardDescription>
          <Badge variant="outline" className={cn("font-semibold", c.badge)}>
            {payload.riskLevel.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-end gap-2 mt-2">
          <span className="text-5xl font-semibold tracking-tight text-foreground">
            {formatRiskScore(payload.riskScore)}
          </span>
          <span className="text-muted-foreground mb-1.5">{t.report.risk.outOf(payload.riskScore)}</span>
        </div>
        <div className="mt-3 h-1.5 w-full rounded-full bg-white/[0.04] overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", c.dot)}
            style={{ width: `${formatRiskScore(payload.riskScore)}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {payload.riskExplanation}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-3">
          {t.report.documentType(payload.documentType)}
          {payload.confidence} ({locale})
        </p>
      </CardContent>
    </Card>
  );
}

/* ------------------------------ Executive Summary ------------------------- */

function ExecutiveSummaryCard({ payload }: { payload: AnalysisPayload }) {
  const { t } = useLocale();
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          {t.report.exec.tag}
        </CardDescription>
        <CardTitle className="text-xl font-semibold tracking-tight text-pretty">
          {payload.documentType || t.report.exec.fallback}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 leading-relaxed text-pretty">
          {payload.executiveSummary}
        </p>
      </CardContent>
    </Card>
  );
}

/* --------------------------- Plain English explanation --------------------- */

function PlainEnglishCard({ payload }: { payload: AnalysisPayload }) {
  const { t } = useLocale();
  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          {t.report.plain.tag}
        </CardDescription>
        <CardTitle>{t.report.plain.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 leading-relaxed text-pretty">
          {payload.plainEnglishExplanation}
        </p>
      </CardContent>
    </Card>
  );
}

/* --------------------------------- Key Clauses ----------------------------- */

function KeyClausesCard({ payload }: { payload: AnalysisPayload }) {
  const { t } = useLocale();
  if (payload.keyClauses.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <KeyRound className="h-3.5 w-3.5" />
          {t.report.clauses.tag}
        </CardDescription>
        <CardTitle>{t.report.clauses.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {payload.keyClauses.map((kc, i) => (
          <div key={i}>
            <p className="text-sm font-medium text-foreground">{kc.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1 text-pretty">
              {kc.explanation}
            </p>
            {i < payload.keyClauses.length - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ---------------------------------- Red Flags ------------------------------ */

function RedFlagsCard({ payload }: { payload: AnalysisPayload }) {
  const { t } = useLocale();
  if (payload.redFlags.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
            {t.report.redFlags.tag}
          </CardDescription>
          <CardTitle>{t.report.redFlags.emptyTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t.report.redFlags.emptyBody}
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-300" />
          {t.report.redFlags.tag}
        </CardDescription>
        <CardTitle>{t.report.redFlags.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {payload.redFlags.map((flag: RedFlag, i) => (
          <RedFlagRow key={i} flag={flag} />
        ))}
      </CardContent>
    </Card>
  );
}

function RedFlagRow({ flag }: { flag: RedFlag }) {
  const c = riskClasses(flag.severity);
  return (
    <div
      className={cn(
        "rounded-lg border bg-white/[0.02] p-4",
        c.border,
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("mt-1.5 h-2 w-2 rounded-full shrink-0", c.dot)} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-foreground">{flag.title}</p>
            <Badge variant="outline" className={cn("uppercase text-[10px]", c.badge)}>
              {flag.severity}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1.5 text-pretty">
            {flag.detail}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Obligations by Party ------------------------ */

function ObligationsCard({ payload }: { payload: AnalysisPayload }) {
  const { t } = useLocale();
  if (payload.obligations.length === 0) return null;
  const parties = ["you", "counterparty", "mutual"] as const;
  const labelFor = (p: (typeof parties)[number]) => {
    if (p === "you") return t.report.obligations.you;
    if (p === "counterparty") return t.report.obligations.counterparty;
    return t.report.obligations.mutual;
  };
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <ClipboardList className="h-3.5 w-3.5" />
          {t.report.obligations.tag}
        </CardDescription>
        <CardTitle>{t.report.obligations.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {parties.map((p) => {
          const entry = payload.obligations.find((o) => o.party === p);
          if (!entry || entry.items.length === 0) return null;
          return (
            <div key={p}>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {labelFor(p)}
              </p>
              <ul className="space-y-2">
                {entry.items.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-foreground/90 leading-relaxed flex gap-2.5"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/* ----------------------------- Payment / Termination ----------------------- */

function PaymentTermsCard({ payload }: { payload: AnalysisPayload }) {
  const { t } = useLocale();
  const tp = payload.paymentTerms;
  const hasAny = tp.amount || tp.schedule || tp.lateFees || tp.notes;
  if (!hasAny) return null;
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <Wallet className="h-3.5 w-3.5" />
          {t.report.payment.tag}
        </CardDescription>
        <CardTitle>{t.report.payment.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <TermRow label={t.report.payment.amount} value={tp.amount} />
          <TermRow label={t.report.payment.schedule} value={tp.schedule} />
          <TermRow label={t.report.payment.lateFees} value={tp.lateFees} />
          <TermRow label={t.report.payment.notes} value={tp.notes} />
        </dl>
      </CardContent>
    </Card>
  );
}

function TerminationCard({ payload }: { payload: AnalysisPayload }) {
  const { t } = useLocale();
  const tn = payload.termination;
  const hasAny = tn.notice || tn.renewal || tn.cancellation || tn.notes;
  if (!hasAny) return null;
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <Repeat2 className="h-3.5 w-3.5" />
          {t.report.termination.tag}
        </CardDescription>
        <CardTitle>{t.report.termination.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <TermRow label={t.report.termination.notice} value={tn.notice} />
          <TermRow label={t.report.termination.renewal} value={tn.renewal} />
          <TermRow label={t.report.termination.cancellation} value={tn.cancellation} />
          <TermRow label={t.report.termination.notes} value={tn.notes} />
        </dl>
      </CardContent>
    </Card>
  );
}

function TermRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-foreground/90 leading-relaxed">{value}</dd>
    </div>
  );
}

/* ------------------------------- Deadlines --------------------------------- */

function DeadlinesCard({ payload }: { payload: AnalysisPayload }) {
  const { t } = useLocale();
  if (payload.deadlines.length === 0) return null;
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {t.report.deadlines.tag}
        </CardDescription>
        <CardTitle>{t.report.deadlines.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {payload.deadlines.map((d, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.04] text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-foreground/90 leading-relaxed text-pretty">
                  {d.event}
                </p>
                {d.date && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(d.date)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/* ---------------------------- Missing Protections -------------------------- */

function MissingProtectionsCard({ payload }: { payload: AnalysisPayload }) {
  const { t } = useLocale();
  if (payload.missingProtections.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <XCircle className="h-3.5 w-3.5 text-rose-300" />
          {t.report.missing.tag}
        </CardDescription>
        <CardTitle>{t.report.missing.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2.5">
          {payload.missingProtections.map((m, i) => (
            <li
              key={i}
              className="text-sm text-foreground/90 leading-relaxed flex gap-2.5"
            >
              <XCircle className="h-4 w-4 text-rose-400/80 mt-0.5 shrink-0" />
              <span className="text-pretty">{m}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/* ----------------------------- Ambiguous Language -------------------------- */

function AmbiguousLanguageCard({ payload }: { payload: AnalysisPayload }) {
  const { t } = useLocale();
  if (payload.ambiguousLanguage.length === 0) return null;
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <MessageSquareWarning className="h-3.5 w-3.5 text-amber-300" />
          {t.report.ambiguous.tag}
        </CardDescription>
        <CardTitle>{t.report.ambiguous.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {payload.ambiguousLanguage.map((a, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-white/[0.02] p-4"
          >
            <blockquote className="border-l-2 border-amber-500/40 pl-3 italic text-sm text-foreground/90 leading-relaxed text-pretty">
              "{a.quote}"
            </blockquote>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2 text-pretty">
              <span className="text-foreground/80 font-medium">{t.report.ambiguous.why}</span>
              {a.whyUnclear}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ------------------------------ Questions to Ask --------------------------- */

function QuestionsCard({ payload }: { payload: AnalysisPayload }) {
  const { t } = useLocale();
  const { copied, copy } = useCopy();
  const numbered = payload.questionsToAsk.map((q, i) => `${i + 1}. ${q}`).join("\n\n");
  return (
    <Card className="md:col-span-3 border-primary/30">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardDescription className="flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            {t.report.questions.tag}
          </CardDescription>
          <CardTitle>{t.report.questions.title}</CardTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copy(numbered)}
          aria-label={t.report.questions.copyAria}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              {t.report.questions.copied}
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              {t.report.questions.copy}
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {payload.questionsToAsk.map((q, i) => (
            <li
              key={i}
              className="text-sm text-foreground/90 leading-relaxed flex gap-3"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {i + 1}
              </span>
              <span className="text-pretty">{q}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

/* ----------------------------- Negotiation Opportunities ------------------- */

function NegotiationCard({ payload }: { payload: AnalysisPayload }) {
  const { t } = useLocale();
  if (payload.negotiationOpportunities.length === 0) return null;
  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <Lightbulb className="h-3.5 w-3.5" />
          {t.report.negotiation.tag}
        </CardDescription>
        <CardTitle>{t.report.negotiation.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {payload.negotiationOpportunities.map((n, i) => (
            <li
              key={i}
              className="rounded-lg border border-border bg-white/[0.02] p-3.5 text-sm text-foreground/90 leading-relaxed flex gap-3"
            >
              <Lightbulb className="h-4 w-4 text-amber-300 mt-0.5 shrink-0" />
              <span className="text-pretty">{n}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/* ------------------------- Confidence / Caveat / Disclaimer ---------------- */

function ConfidenceCard({ payload }: { payload: AnalysisPayload }) {
  const { t } = useLocale();
  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <Scale className="h-3.5 w-3.5" />
          {t.report.confidence.tag}
        </CardDescription>
        <CardTitle>{t.report.confidence.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="muted">
            {t.report.documentType("").replace(" · ", "")}: {payload.confidence}
          </Badge>
          <Badge variant="muted">{t.report.confidence.educational}</Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
          {payload.caveat}
        </p>
      </CardContent>
    </Card>
  );
}

function DisclaimerBanner() {
  const { t } = useLocale();
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-4 md:p-5 text-sm">
      <p className="font-medium text-amber-200">
        {t.report.disclaimer.title}
      </p>
      <p className="text-amber-200/80 mt-1.5 leading-relaxed">
        {t.report.disclaimer.body}
      </p>
    </div>
  );
}

/* ---------------------------------- Report --------------------------------- */

export function Report({ payload }: { payload: AnalysisPayload }) {
  const { t } = useLocale();
  const ref = React.useRef<HTMLDivElement | null>(null);
  // Smooth-scroll into view the first time a report renders.
  React.useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section
      ref={ref}
      id="report"
      className="space-y-4 animate-fade-in"
      aria-labelledby="report-heading"
    >
      <header className="flex items-end justify-between gap-4 pt-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {t.report.heading.tag}
          </p>
          <h2
            id="report-heading"
            className="text-2xl md:text-3xl font-semibold tracking-tight text-balance"
          >
            {t.report.heading.title}
          </h2>
        </div>
        <Badge variant="muted" className="hidden sm:inline-flex">
          <Sparkles className="h-3 w-3" />
          {t.report.heading.generatedBy}
        </Badge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RiskScoreCard payload={payload} />
        <ExecutiveSummaryCard payload={payload} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlainEnglishCard payload={payload} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KeyClausesCard payload={payload} />
        <RedFlagsCard payload={payload} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ObligationsCard payload={payload} />
        <div className="space-y-4">
          <PaymentTermsCard payload={payload} />
          <TerminationCard payload={payload} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MissingProtectionsCard payload={payload} />
        <DeadlinesCard payload={payload} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AmbiguousLanguageCard payload={payload} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuestionsCard payload={payload} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NegotiationCard payload={payload} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ConfidenceCard payload={payload} />
      </div>

      <DisclaimerBanner />
    </section>
  );
}
