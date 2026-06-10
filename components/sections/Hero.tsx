"use client";

import { Sparkles, ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n";

/**
 * The Hero lets users jump into the analyzer with a sample document
 * (or just into the paste tab). The Analyzer listens for these events.
 *
 * Custom events keep the Hero free of any awareness of the analyzer's
 * internal state — no props drilling, no context, no prop coupling.
 */

const TRY_SAMPLE_EVENT = "offershield:try-sample";
const FOCUS_PASTE_EVENT = "offershield:focus-paste";

export function dispatchTrySample(sampleId: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TRY_SAMPLE_EVENT, { detail: { sampleId } }));
  const el = document.getElementById("analyzer");
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function dispatchFocusPaste() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(FOCUS_PASTE_EVENT));
  const el = document.getElementById("analyzer");
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Re-export event names so the Analyzer can listen for them. */
export const ANALYZER_EVENTS = {
  TRY_SAMPLE: TRY_SAMPLE_EVENT,
  FOCUS_PASTE: FOCUS_PASTE_EVENT,
} as const;

export function Hero() {
  const { t } = useLocale();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient" aria-hidden />
      <div className="absolute inset-0 bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />

      <div className="container relative pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="muted" className="mb-6 mx-auto inline-flex">
            <Sparkles className="h-3 w-3 text-indigo-300" />
            {t.hero.badge}
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-balance leading-[1.05]">
            {t.hero.h1Before}{" "}
            <span className="bg-gradient-to-br from-indigo-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
              {t.hero.h1Highlight}
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
            {t.hero.subhead}
            <span className="text-foreground/80">
              {t.hero.subheadHighlight}
            </span>
            .
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              variant="gradient"
              onClick={() => dispatchTrySample("freelance")}
            >
              <Sparkles className="h-4 w-4" />
              {t.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={dispatchFocusPaste}
            >
              {t.hero.ctaSecondary}
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              {t.hero.private}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              {t.hero.educational}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
