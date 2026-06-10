import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

export const runtime = "edge";
export const alt = "OfferShield.pro — Understand contracts before you sign";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "es" },
    { lang: "zh" },
  ];
}

/**
 * Social-share card for OfferShield.pro.
 *
 * Brand voice stays in English (the marketing/identity language of
 * the product) regardless of which locale the page is being served
 * from, so a link shared from `/es` or `/zh` still shows a clean,
 * professional English card on Twitter / LinkedIn / WhatsApp.
 *
 * The page itself remains fully localized — only the *share card*
 * stays in English.
 *
 * Implementation notes for @vercel/og / satori:
 *   - Every <div> with more than one child must set
 *     `display: flex` (or `none`) explicitly.
 */
export default function OgImage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  if (!isLocale(lang)) notFound();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "linear-gradient(135deg, #0a0a0c 0%, #11122a 50%, #0a0a0c 100%)",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(56,189,248,0.3))",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: 28,
            }}
          >
            🛡
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: -0.5,
            }}
          >
            OfferShield.pro
          </div>
        </div>

        {/* Headline + tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            Understand contracts before you sign.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.4,
              maxWidth: 950,
            }}
          >
            Plain-English explanations, risk flags, obligations, and smart
            questions — built with love using MiniMax-M3.
          </div>
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          {[
            "Plain English",
            "Risk Flags",
            "Key Dates",
            "Smart Questions",
          ].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                fontSize: 20,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <div style={{ display: "flex" }}>
            Educational, not legal advice.
          </div>
          <div style={{ display: "flex" }}>offershield.pro</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
