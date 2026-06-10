"use client";

import * as React from "react";
import { Download, FileText, FileCode2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AnalysisPayload } from "@/types/analysis";
import { useLocale } from "@/lib/i18n";
import {
  exportHtml,
  exportMarkdown,
  reportFilename,
} from "@/lib/export";

/**
 * "Save this report" footer below the Report component.
 *
 * Two formats:
 *   - HTML — a self-contained, print-friendly document that
 *     looks like a real legal-tech report. The user can open
 *     it in a browser and Ctrl/Cmd+P → Save as PDF.
 *   - Markdown — plain text, easy to paste into Slack/email.
 *
 * Both downloads are generated server-side at request time (well,
 * at the time the user clicks — we ship the route from the
 * /api/export-report route? No: simpler, we generate on the
 * client via Blob. The server stays stateless.
 *
 * The locale follows the user's URL locale. The filename includes
 * the date and the locale code so a Spanish user ends up with
 * `offerShield-report-2026-06-10-es-…` and a Chinese user with
 * the same doc gets `…-zh-…`.
 */

interface DownloadReportProps {
  payload: AnalysisPayload;
}

type Format = "html" | "md";

export function DownloadReport({ payload }: DownloadReportProps) {
  const { t, locale } = useLocale();
  const [busy, setBusy] = React.useState<Format | null>(null);
  const [done, setDone] = React.useState<Format | null>(null);

  const trigger = (format: Format) => {
    try {
      setBusy(format);
      const content =
        format === "html"
          ? exportHtml(payload, t, locale)
          : exportMarkdown(payload, t, locale);
      const mime = format === "html" ? "text/html;charset=utf-8" : "text/markdown;charset=utf-8";
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = reportFilename(format, locale, payload.documentType);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Revoke after a tick so the click is processed first
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDone(format);
      window.setTimeout(() => setDone(null), 1800);
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold tracking-tight">
              {t.report.download.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              {t.report.download.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => trigger("html")}
              disabled={busy !== null}
              className={cn(
                "min-w-[140px]",
                done === "html" && "bg-emerald-600 hover:bg-emerald-600",
              )}
            >
              {done === "html" ? (
                <>
                  <Check className="h-4 w-4" />
                  {t.report.download.htmlButton}
                </>
              ) : busy === "html" ? (
                <>
                  <Download className="h-4 w-4 animate-pulse" />
                  {t.report.download.generating}
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  {t.report.download.htmlButton}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => trigger("md")}
              disabled={busy !== null}
              className={cn(
                "min-w-[140px]",
                done === "md" && "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-600",
              )}
            >
              {done === "md" ? (
                <>
                  <Check className="h-4 w-4" />
                  {t.report.download.markdownButton}
                </>
              ) : busy === "md" ? (
                <>
                  <Download className="h-4 w-4 animate-pulse" />
                  {t.report.download.generating}
                </>
              ) : (
                <>
                  <FileCode2 className="h-4 w-4" />
                  {t.report.download.markdownButton}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
