import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://offershield.app";

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
    locale: "en_US",
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
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
