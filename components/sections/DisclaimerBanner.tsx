"use client";

import { Scale } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export function DisclaimerBanner() {
  const { t } = useLocale();
  return (
    <section id="disclaimer" className="py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-300">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-amber-100">
                {t.disclaimer.title}
              </h2>
              <p className="mt-2 text-sm text-amber-200/80 leading-relaxed text-pretty">
                {t.disclaimer.body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
