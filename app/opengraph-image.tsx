import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OfferShield — Understand contracts before you sign";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              display: "flex",
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
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>
            OfferShield
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 950,
            }}
          >
            Understand contracts{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, #a5b4fc, #7dd3fc, #c4b5fd)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              before you sign.
            </span>
          </div>
          <div
            style={{
              fontSize: 26,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            Plain-English explanations, risk flags, obligations, and smart
            questions — built with love using MiniMax-M3.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <div>Educational, not legal advice.</div>
          <div>offershield.pro</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
