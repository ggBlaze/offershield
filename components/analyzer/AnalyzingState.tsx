"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "@/lib/i18n";

/**
 * Loading state shown while the AI is generating the analysis.
 *
 * Three parallel timers:
 *   - Rotates through 6 status messages every ~1.4s
 *   - Ticks the elapsed-second counter every 1s
 *   - Picks an ETA based on the document size, then refines it
 *     as time passes
 *
 * ETA is honest: it varies with document length (longer
 * contracts = wider ETA range), and it ticks down to seconds
 * once we're inside the lower bound. After the upper bound
 * elapses we switch to "Finishing up…" so the user doesn't
 * panic.
 */

interface AnalyzingStateProps {
  /**
   * Length of the document being analyzed, in characters. Used to
   * pick an ETA range. Pass 0 for "unknown" (falls back to the
   * short-document bucket).
   */
  textLength?: number;
}

interface EtaRange {
  min: number; // seconds — start ticking down from here
  max: number; // seconds — switch to "Finishing up…" past here
}

function estimateEta(textLength: number): EtaRange {
  if (textLength < 2_000) return { min: 30, max: 60 };
  if (textLength < 10_000) return { min: 60, max: 120 };
  return { min: 120, max: 180 };
}

function formatEta(
  elapsed: number,
  range: EtaRange,
  t: {
    etaPrefix: string;
    etaRange: (lo: number, hi: number) => string;
    etaMinutes: (n: number) => string;
    etaSeconds: (n: number) => string;
    etaFinishing: string;
  },
): string {
  if (elapsed >= range.max) return t.etaFinishing;
  if (elapsed < range.min) {
    // Still inside the initial range — show the wide estimate.
    const lo = Math.round(range.min / 60);
    const hi = Math.round(range.max / 60);
    return `${t.etaPrefix} ${t.etaRange(lo, hi)}`;
  }
  // Inside [range.min, range.max] — show remaining.
  const remaining = range.max - elapsed;
  if (remaining >= 60) {
    const mins = Math.ceil(remaining / 60);
    return `${t.etaPrefix} ${t.etaMinutes(mins)}`;
  }
  return `${t.etaPrefix} ${t.etaSeconds(remaining)}`;
}

export function AnalyzingState({ textLength = 0 }: AnalyzingStateProps) {
  const { t } = useLocale();
  const [idx, setIdx] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);
  // The dictionary is declared `as const`, so this tuple is typed
  // as a fixed-length 6-tuple of literal strings. We widen to
  // readonly string[] so the .length / indexing logic stays dynamic.
  const messages: readonly string[] = t.analyzing.messages;

  // Memoize the range so it doesn't recompute every tick
  const range = React.useMemo(() => estimateEta(textLength), [textLength]);

  // Rotate the status message
  React.useEffect(() => {
    if (messages.length === 0) return;
    const handle = window.setInterval(() => {
      setIdx((i) => (i + 1) % messages.length);
    }, 1400);
    return () => window.clearInterval(handle);
  }, [messages.length]);

  // Tick elapsed time
  React.useEffect(() => {
    const handle = window.setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => window.clearInterval(handle);
  }, []);

  const current = messages[idx] ?? messages[0] ?? "…";
  const etaText = formatEta(elapsed, range, t.analyzing);

  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
        </span>
        <span className="text-foreground/90">{current}</span>
        <span className="text-muted-foreground/40">·</span>
        <span className="font-mono text-foreground/60 tabular-nums">
          {etaText}
        </span>
      </div>

      {/* Skeleton placeholders matching the report layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-3 w-full" />
          </CardHeader>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <Card key={i}>
            <CardHeader className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-9/12" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-10/12" />
              <Skeleton className="h-3 w-8/12" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-3 w-32" />
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardHeader>
      </Card>
    </div>
  );
}
