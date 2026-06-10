"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  retryable?: boolean;
}

export function ErrorState({ message, onRetry, retryable = true }: ErrorStateProps) {
  const { t } = useLocale();
  return (
    <Card className="border-rose-500/30 bg-rose-500/[0.04]">
      <CardContent className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-300">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold">{t.errorState.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
        </div>
        {retryable && (
          <Button onClick={onRetry} variant="outline" className="shrink-0">
            <RotateCcw className="h-4 w-4" />
            {t.errorState.retry}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
