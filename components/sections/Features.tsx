"use client";

import {
  FileText,
  AlertTriangle,
  CalendarDays,
  HelpCircle,
  Layers,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n";

const ICONS = [FileText, AlertTriangle, CalendarDays, HelpCircle, Layers, Lock];

export function Features() {
  const { t } = useLocale();
  return (
    <section id="features" className="py-20 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {t.features.tag}
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-balance">
            {t.features.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.features.items.map((f, i) => {
            const Icon = ICONS[i] ?? FileText;
            return (
              <Card key={i} className="hover:border-white/15 transition-colors">
                <CardContent className="p-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] text-foreground ring-1 ring-white/10 mb-4">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed text-pretty">
                    {f.body}
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
