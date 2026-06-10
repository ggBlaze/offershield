import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

export const runtime = "edge";
export const alt = "OfferShield — Understand contracts before you sign";
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
 * Per-locale dynamic OG image. The text on the share card is localized
 * so a Spanish link shared on Twitter/X shows Spanish text in the
 * preview, etc.
 *
 * Implementation notes for @vercel/og:
 *   - Every <div> with more than one child node must set
 *     `display: flex` (or `none`) explicitly. We default everything
 *     to flex and use the children property to control layout.
 *   - We avoid whitespace text nodes between elements by using
 *     `display: flex` on every parent and the `children` pattern.
 */
export default function OgImage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  if (!isLocale(lang)) notFound();

  const { headline, tagline, disclaimer, url } = copyFor(lang);

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
              width: 48,
              height: 48,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(56,189,248,0.3))",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: 24,
            }}
          >
            🛡
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: -0.5,
            }}
          >
            OfferShield
          </div>
        </div>

        {/* Headline + tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 950,
            }}
          >
            {headline}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.4,
              maxWidth: 950,
            }}
          >
            {tagline}
          </div>
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
          <div style={{ display: "flex" }}>{disclaimer}</div>
          <div style={{ display: "flex" }}>{url}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}

function copyFor(lang: Locale): {
  headline: string;
  tagline: string;
  disclaimer: string;
  url: string;
} {
  switch (lang) {
    case "es":
      return {
        headline: "Entiende los contratos antes de firmar.",
        tagline:
          "Resúmenes claros, alertas de riesgo, obligaciones y preguntas que hacer — hecho con MiniMax-M3.",
        disclaimer: "Educativo, no consejo legal.",
        url: "offershield.pro/es",
      };
    case "zh":
      return {
        headline: "签署之前,先读懂合同。",
        tagline:
          "通俗易懂的中文摘要、风险提示、双方义务清单,以及值得提出的问题 — 用 MiniMax-M3 用心打造。",
        disclaimer: "仅供参考,非法律建议。",
        url: "offershield.pro/zh",
      };
    case "en":
    default:
      return {
        headline: "Understand contracts before you sign.",
        tagline:
          "Plain-English explanations, risk flags, obligations, and smart questions — built with MiniMax-M3.",
        disclaimer: "Educational, not legal advice.",
        url: "offershield.pro/en",
      };
  }
}
