"use client";

import * as React from "react";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";

/**
 * React context for the current locale.
 *
 * The provider renders with `DEFAULT_LOCALE` on the server and on the
 * first client render, so server-rendered HTML matches the initial
 * client HTML (no hydration mismatch). On mount, we read the stored
 * locale from `localStorage` and update — any localized text below
 * that needed to change updates immediately.
 */
export interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dictionary;
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(DEFAULT_LOCALE);

  // Load from localStorage on mount, after hydration.
  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isLocale(stored) && stored !== locale) {
        setLocaleState(stored);
      }
    } catch {
      // localStorage may be unavailable (private mode, etc.) — fall back silently.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, l);
    } catch {
      // Ignore.
    }
    // Reflect on the <html lang="…"> attribute for assistive tech and SEO.
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
    }
  }, []);

  const value = React.useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

/**
 * Hook to read the current locale + dictionary from context. Throws if
 * used outside a `<LocaleProvider>` (which is always mounted in the
 * root layout).
 */
export function useLocale(): LocaleContextValue {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used inside <LocaleProvider>");
  }
  return ctx;
}
