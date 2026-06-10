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
 * Clicking a pill:
 *   1) Dispatches a "offershield:locale-change" event so the
 *      LocaleProvider updates its state immediately (the UI
 *      re-renders in the new language on the next paint, with no
 *      form-state loss).
 *   2) Updates the NEXT_LOCALE cookie so the root `/` redirect
 *      honors the choice on the next visit.
 *   3) Saves the choice to localStorage as a redundant backup.
 *   4) Navigates to /[lang]/ via router.push (soft navigation).
 *
 * The current locale is derived from the URL (the [lang] segment)
 * plus any in-flight event updates, so the switcher reflects
 * exactly what the user just clicked even before RSC arrives.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  // First URL segment after the leading slash. May be a locale code
  // (en/es/zh) or — when the user is on `/` — an empty string.
  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
  const urlLang: Locale = isLocale(firstSegment) ? firstSegment : "en";

  // The currently active locale: we read the URL on first render,
  // and an event listener (mounted below) updates this state when
  // the user clicks a pill so the highlight flips immediately.
  const [activeLang, setActiveLang] = React.useState<Locale>(urlLang);

  React.useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ locale: Locale }>).detail;
      if (isLocale(detail?.locale)) setActiveLang(detail.locale);
    };
    window.addEventListener("offershield:locale-change", onChange);
    return () =>
      window.removeEventListener("offershield:locale-change", onChange);
  }, []);

  // Also re-sync from the URL on pathname changes (covers the case
  // where the user navigates with the browser's back/forward).
  React.useEffect(() => {
    setActiveLang(urlLang);
  }, [urlLang]);

  const navigate = (target: Locale) => {
    // 1) Tell the LocaleProvider to update right now so the UI
    //    re-renders in the new language before the next RSC paint.
    window.dispatchEvent(
      new CustomEvent("offershield:locale-change", {
        detail: { locale: target },
      }),
    );

    // 2) Persist the choice so the root `/` redirect honors it on
    //    the next visit (the middleware reads this cookie).
    try {
      document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    } catch {
      // Ignore (e.g. document.cookie disabled in some sandboxes).
    }

    // 3) Redundant localStorage backup.
    try {
      window.localStorage.setItem("offershield:locale", target);
    } catch {
      // ignore
    }

    // 4) Soft-navigate to the new locale URL.
    const tail = isLocale(firstSegment)
      ? pathname.replace(/^\/[^/]+/, "")
      : pathname;
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
          aria-pressed={activeLang === code}
          aria-label={LOCALE_LABELS[code]}
          title={LOCALE_LABELS[code]}
          className={cn(
            "min-w-[2.25rem] rounded-full px-2.5 py-1 font-medium transition-all focus-ring",
            activeLang === code
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
