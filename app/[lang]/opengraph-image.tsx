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
 * Per-locale dynamic OG image.
 *
 * The card text is in the same language as the URL: a Spanish link
 * shared on Twitter/X shows a Spanish card, a Chinese link shows a
 * Chinese card, and so on. The product name "OfferShield.pro" stays
 * in Latin script everywhere (it's a brand mark, not a sentence).
 *
 * Implementation notes for @vercel/og / satori:
 *   - Every <div> with more than one child must set
 *     `display: flex` (or `none`) explicitly.
 */
export default function OgImage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  if (!isLocale(lang)) notFound();

  const copy = copyFor(lang);

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
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            {copy.headline}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.45,
              maxWidth: 980,
            }}
          >
            {copy.tagline}
          </div>
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          {copy.pills.map((label) => (
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
          <div style={{ display: "flex" }}>{copy.disclaimer}</div>
          <div style={{ display: "flex" }}>offershield.pro/{lang}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}

interface OgCopy {
  headline: string;
  tagline: string;
  pills: string[];
  disclaimer: string;
}

function copyFor(lang: Locale): OgCopy {
  switch (lang) {
    case "es":
      return {
        headline: "Entiende los contratos antes de firmar.",
        tagline:
          "Resúmenes claros, alertas de riesgo, obligaciones y preguntas que hacer — hecho con MiniMax-M3.",
        pills: [
          "Español claro",
          "Alertas de riesgo",
          "Fechas clave",
          "Preguntas útiles",
        ],
        disclaimer: "Educativo, no consejo legal.",
      };
    case "zh":
      return {
        headline: "签署之前,先读懂合同。",
        tagline:
          "通俗易懂的中文摘要、风险提示、双方义务清单,以及值得提出的问题 — 用 MiniMax-M3 用心打造。",
        pills: ["通俗解读", "风险提示", "关键日期", "实用问题"],
        disclaimer: "仅供参考,非法律建议。",
      };
    case "en":
    default:
      return {
        headline: "Understand contracts before you sign.",
        tagline:
          "Plain-English explanations, risk flags, obligations, and smart questions — built with love using MiniMax-M3.",
        pills: [
          "Plain English",
          "Risk Flags",
          "Key Dates",
          "Smart Questions",
        ],
        disclaimer: "Educational, not legal advice.",
      };
  }
}
