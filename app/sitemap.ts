import type { MetadataRoute } from "next";
import { LOCALES, LOCALE_TAG } from "@/lib/i18n";

const siteUrl = "https://offershield.pro";

/**
 * Sitemap with full hreflang alternates. Search engines will see
 * three entries per logical page (one per locale) and the
 * `<xhtml:link rel="alternate" hreflang="…">` cross-references.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // One sitemap entry per (path, locale). We also attach the full set
  // of alternates to every entry so Google indexes the cluster.
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of LOCALES) {
    entries.push({
      url: `${siteUrl}/${lang}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [LOCALE_TAG[l], `${siteUrl}/${l}`]),
        ),
      },
    });
  }

  // Also include the root URL — it 307-redirects to a locale-specific
  // path, so we declare it but mark it lower priority and let the
  // canonical of the locale pages do the heavy lifting.
  entries.push({
    url: siteUrl,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.5,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_TAG[l], `${siteUrl}/${l}`]),
      ),
    },
  });

  return entries;
}
