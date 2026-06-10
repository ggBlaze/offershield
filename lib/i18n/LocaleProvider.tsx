"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
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
 * After hydration, three things can change the locale:
 *   1) The user clicks a language in <LanguageSwitcher> which
 *      dispatches a "offershield:locale-change" CustomEvent. The
 *      provider picks it up and updates state synchronously, so the
 *      UI re-renders in the new language before the next paint.
 *   2) The user navigates to a different locale URL (soft nav via
 *      router.push). The provider listens to pathname changes as a
 *      backup and re-syncs.
 *   3) The user has a saved preference in localStorage. On mount
 *      we honor it if it differs from the URL's initial locale.
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
  const pathname = usePathname();

  // Sync from the URL when the pathname changes (soft navigation
  // between locales). The first URL segment is the locale code on
  // /[lang]/* routes and the empty string on other paths.
  React.useEffect(() => {
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    if (isLocale(firstSegment) && firstSegment !== locale) {
      setLocaleState(firstSegment);
    }
  }, [pathname, locale]);

  // Listen for explicit locale-change events dispatched by the
  // LanguageSwitcher. We use this in addition to the pathname
  // effect so the UI updates in the *same* paint as the click,
  // rather than waiting for Next's RSC to fetch + render.
  React.useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ locale: Locale }>).detail;
      if (isLocale(detail?.locale) && detail.locale !== locale) {
        setLocaleState(detail.locale);
      }
    };
    window.addEventListener("offershield:locale-change", onChange);
    return () =>
      window.removeEventListener("offershield:locale-change", onChange);
  }, [locale]);

  // On first mount, honor a previously saved preference in
  // localStorage if it differs from the URL-derived initial locale.
  // (The URL is only the default for new visitors.)
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
