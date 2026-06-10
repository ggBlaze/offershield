import { en } from "./dictionaries/en";
import { es } from "./dictionaries/es";
import { zh } from "./dictionaries/zh";
import type { Locale } from "./config";

/**
 * All dictionaries keyed by locale.
 *
 * `Dictionary` is defined in `dictionaries/en.ts` (the source of
 * truth — its `typeof` is the type other locales are checked against).
 *
 * The English dictionary does NOT use `as const` at the top level,
 * so fields like `meta.title` are typed as `string` rather than as a
 * literal — which lets Spanish/Chinese have their own translations
 * without TypeScript complaining. The `analyzing.messages` array
 * still gets the literal-tuple treatment via an explicit
 * `as const` on that field, which is exactly what we want.
 */

export { en } from "./dictionaries/en";
export { es } from "./dictionaries/es";
export { zh } from "./dictionaries/zh";

export const dictionaries = { en, es, zh };

export type Dictionary = typeof en;

