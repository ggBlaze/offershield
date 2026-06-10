"use client";

import { Lock, Server, KeyRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n";

const ICONS = [Lock, Server, KeyRound];

export function Trust() {
  const { t } = useLocale();
  return (
    <section className="py-16 border-t border-white/[0.04]">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.trust.items.map((item, i) => {
            const Icon = ICONS[i] ?? Lock;
            return (
              <Card key={i}>
                <CardContent className="p-6 flex items-start gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20 shrink-0">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
