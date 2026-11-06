import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "KM Foods — Har Ghar Ka Zaiqa";

/**
 * Generated social preview. A real photograph should replace this once the
 * client supplies approved product imagery.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FDFBF7",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              border: "10px solid #A4121B",
              display: "flex",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 54, fontWeight: 700, color: "#2B1E14" }}>
              KM Foods
            </div>
            <div
              style={{
                fontSize: 22,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: "#A4121B",
              }}
            >
              Har Ghar Ka Zaiqa
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 40, color: "#1F3D2B", maxWidth: 900 }}>
            Premium Pakistani spices, dry fruits, seeds and kitchen essentials.
          </div>
          <div style={{ fontSize: 30, color: "#6B5138" }}>
            Delivered across Lahore · Order on WhatsApp
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
