"use client";

import { ClipboardPaste, Sparkles, FileSearch } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n";

const STEPS_ICONS = [ClipboardPaste, Sparkles, FileSearch];

export function HowItWorks() {
  const { t } = useLocale();
  return (
    <section id="how" className="py-20 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {t.howItWorks.tag}
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-balance">
            {t.howItWorks.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.howItWorks.steps.map((step, i) => {
            const Icon = STEPS_ICONS[i] ?? ClipboardPaste;
            return (
              <Card key={i}>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed text-pretty">
                    {step.body}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
