import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { LocaleProvider, isLocale, DEFAULT_LOCALE, LOCALES, LOCALE_TAG } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://offershield.pro";
// Read the GA measurement ID at build time. If unset (the
// .env.example default), the GoogleAnalytics component renders
// nothing — so the script never ships to the browser, no
// tracking happens, and there's no key to leak in the bundle.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";

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
    title: "OfferShield.pro — Understand contracts before you sign",
    description:
      "Plain-English explanations, risk flags, obligations, and smart questions to ask. Built with love using MiniMax-M3.",
    siteName: "OfferShield.pro",
    images: [
      {
        url: `${siteUrl}/en/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "OfferShield.pro — Understand contracts before you sign",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OfferShield.pro — Understand contracts before you sign",
    description:
      "Plain-English explanations, risk flags, obligations, and smart questions to ask. Built with love using MiniMax-M3.",
    creator: "@OGDegen",
    site: "@OGDegen",
    images: [`${siteUrl}/en/opengraph-image`],
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
        {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
      </body>
    </html>
  );
}
