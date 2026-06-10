"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  LOCALES,
  LOCALE_LABELS,
  LOCALE_SHORT,
  useLocale,
  type Locale,
} from "@/lib/i18n";

/**
 * Three pill buttons for English / Español / 中文.
 * The active language is highlighted; switching is instant and persists
 * in localStorage.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-secondary/50 p-0.5 text-xs",
        className,
      )}
    >
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          aria-label={LOCALE_LABELS[code]}
          title={LOCALE_LABELS[code]}
          className={cn(
            "min-w-[2.25rem] rounded-full px-2.5 py-1 font-medium transition-all focus-ring",
            locale === code
              ? "bg-background text-foreground shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {LOCALE_SHORT[code as Locale]}
        </button>
      ))}
    </div>
  );
}
