import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GDG MIT-WPU — Google Developer Groups on Campus";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#090909",
          color: "#F3F2EE",
          padding: "56px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 84, fontWeight: 700, letterSpacing: -3 }}>
          <span style={{ color: "#4285F4" }}>[</span>GDG MIT-WPU<span style={{ color: "#EA4335" }}>]</span>
        </div>
        <div style={{ fontSize: 24, opacity: 0.75, marginTop: 16 }}>Google Developer Groups on Campus • Pune</div>
        <div style={{ fontSize: 18, opacity: 0.6, marginTop: 8 }}>gdg-mitwpu.in — Learn • Build • Grow</div>
      </div>
    ),
    { ...size }
  );
}
