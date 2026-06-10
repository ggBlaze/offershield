"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "@/lib/i18n";

export function AnalyzingState() {
  const { t } = useLocale();
  const [idx, setIdx] = React.useState(0);
  const messages = t.analyzing.messages;

  React.useEffect(() => {
    if (messages.length === 0) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % messages.length);
    }, 1400);
    return () => clearInterval(t);
  }, [messages.length]);

  const current = messages[idx] ?? messages[0] ?? "…";

  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
        </span>
        <span className="text-foreground/90">{current}</span>
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
