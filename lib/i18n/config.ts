/**
 * Locale configuration. English is the default; Spanish and Simplified
 * Chinese are supported. Add more locales by adding an entry to
 * LOCALES, LOCALE_LABELS, and a matching dictionary under
 * dictionaries/.
 */

export const LOCALES = ["en", "es", "zh"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  zh: "中文",
};

export const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  zh: "中",
};

/** BCP-47 tag for the locale, used by Intl APIs. */
export const LOCALE_TAG: Record<Locale, string> = {
  en: "en-US",
  es: "es-ES",
  zh: "zh-CN",
};

/** Human-readable language name for the model prompt. */
export const LOCALE_PROMPT_NAME: Record<Locale, string> = {
  en: "English",
  es: "Spanish (Español)",
  zh: "Simplified Chinese (简体中文)",
};

/** Storage key for the user's selected locale. */
export const LOCALE_STORAGE_KEY = "offershield:locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
