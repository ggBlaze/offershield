"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LOCALES,
  LOCALE_LABELS,
  LOCALE_SHORT,
  isLocale,
  type Locale,
} from "@/lib/i18n";

/**
 * Three pill buttons for English / Español / 中文.
 *
 * Clicking a pill navigates to the corresponding /[lang]/ URL. This is
 * the only way to get SEO credit for each language: every locale must
 * be its own URL so search engines can index it separately.
 *
 * The current locale is derived from the URL (the [lang] segment),
 * not from React state, so the switcher reflects exactly what the
 * server thinks it's serving.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  // First URL segment after the leading slash. May be a locale code
  // (en/es/zh) or — when the user is on `/` — an empty string.
  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
  const currentLang: Locale = isLocale(firstSegment) ? firstSegment : "en";

  const navigate = (target: Locale) => {
    // Persist the choice so the root `/` redirect honors it on future visits.
    try {
      window.localStorage.setItem("offershield:locale", target);
    } catch {
      // ignore
    }
    // Replace the leading locale segment (if any) with the new one.
    // If the user is on a non-locale-prefixed path, just push /[target].
    const tail = isLocale(firstSegment) ? pathname.replace(/^\/[^/]+/, "") : pathname;
    const next = `/${target}${tail || ""}`;
    router.push(next);
  };

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
          onClick={() => navigate(code)}
          aria-pressed={currentLang === code}
          aria-label={LOCALE_LABELS[code]}
          title={LOCALE_LABELS[code]}
          className={cn(
            "min-w-[2.25rem] rounded-full px-2.5 py-1 font-medium transition-all focus-ring",
            currentLang === code
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
