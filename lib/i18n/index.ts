export {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_LABELS,
  LOCALE_PROMPT_NAME,
  LOCALE_SHORT,
  LOCALE_STORAGE_KEY,
  LOCALE_TAG,
  isLocale,
  type Locale,
} from "./config";

export { dictionaries, type Dictionary } from "./dictionaries";

export { LocaleProvider, useLocale, type LocaleContextValue } from "./LocaleProvider";
