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
 * The provider can be initialized with a server-known `initialLocale`
 * (typically derived from the URL by middleware). That value drives
 * the first render — both the server render and the matching client
 * hydration render — so the HTML is in the right language for SEO.
 *
 * After hydration, the user can still switch languages; we read the
 * stored value from `localStorage` on mount to honor a previously
 * saved preference (if the URL didn't already dictate it).
 */
export interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dictionary;
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  children: React.ReactNode;
  /**
   * Locale to render on the server and on first client render. Should
   * be derived from the URL (or another server-known source) so that
   * the HTML matches the request. Defaults to `DEFAULT_LOCALE`.
   */
  initialLocale?: Locale;
}

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale);

  // Load from localStorage on mount, after hydration. If the stored
  // value differs from what the URL said, the user's saved preference
  // wins. (The URL is only the default for new visitors.)
  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isLocale(stored) && stored !== initialLocale) {
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
