"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLocale } from "@/lib/i18n";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLocale();
  useEffect(() => {
    console.error("[offershield] app error:", error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="container py-20">
        <Card className="max-w-xl mx-auto">
          <CardContent className="p-8 flex flex-col items-center text-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-300">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                {t.errorState.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
                OfferShield hit an unexpected error. You can try again, or come
                back in a moment.
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground/70 mt-2 font-mono">
                  Reference: {error.digest}
                </p>
              )}
            </div>
            <Button onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              {t.errorState.retry}
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
