import { en } from "./dictionaries/en";
import { es } from "./dictionaries/es";
import { zh } from "./dictionaries/zh";
import type { Locale } from "./config";

/**
 * All dictionaries keyed by locale. The type of `en` is the source of
 * truth — `es` and `zh` are type-checked against it so a missing
 * translation becomes a TypeScript error.
 */
export const dictionaries = {
  en,
  es,
  zh,
} satisfies Record<Locale, typeof en>;

export type Dictionary = typeof en;
