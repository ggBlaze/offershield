import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { LocaleProvider, isLocale, DEFAULT_LOCALE, LOCALES, LOCALE_TAG } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://offershield.pro";

/**
 * Top-level metadata. Per-locale title, description, and hreflang
 * alternates are emitted by `app/[lang]/page.tsx` via
 * `generateMetadata`. Anything declared here is the fallback that
 * search engines see for routes without their own metadata — in
 * practice every visible page lives under [lang], so this is just a
 * safety net.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OfferShield — Understand contracts before you sign",
    template: "%s · OfferShield",
  },
  description:
    "OfferShield turns dense legal text into plain-English summaries, risk flags, obligations, and smart questions to ask. Built with love using MiniMax-M3.",
  applicationName: "OfferShield",
  keywords: [
    "contract explainer",
    "offer letter analyzer",
    "AI legal assistant",
    "contract review",
    "freelance contract",
    "NDA analyzer",
    "MiniMax-M3",
  ],
  authors: [{ name: "OfferShield" }],
  creator: "OfferShield",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "OfferShield — Understand contracts before you sign",
    description:
      "Plain-English explanations of contracts, offer letters, NDAs, and more. Built with MiniMax-M3.",
    siteName: "OfferShield",
  },
  twitter: {
    card: "summary_large_image",
    title: "OfferShield — Understand contracts before you sign",
    description:
      "Plain-English explanations of contracts and offer letters. Built with MiniMax-M3.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The middleware writes the URL-derived locale into a request header
  // (`x-offerShield-locale`). We read it here to:
  //   1) set <html lang> correctly per request (search engines and a11y)
  //   2) seed the LocaleProvider so the first render — both server and
  //      hydration — uses the right language for SEO and no FOUC
  const headerLocale = headers().get("x-offerShield-locale");
  const initialLocale = isLocale(headerLocale) ? headerLocale : DEFAULT_LOCALE;
  const htmlLang = LOCALE_TAG[initialLocale].split("-")[0] ?? initialLocale;

  return (
    <html lang={htmlLang} className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}

/** Re-export for convenience so other files can iterate locales. */
export { LOCALES };
