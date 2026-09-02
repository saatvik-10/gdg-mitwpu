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
          justifyContent: "space-between",
          background: "#090909",
          color: "#F3F2EE",
          padding: "56px 56px 48px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: 0.7, fontSize: 14, letterSpacing: 6, textTransform: "uppercase" as const }}>
          Google Developer Groups • MIT-WPU • Pune
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 0.9 }}>
            <span style={{ color: "#4285F4" }}>[</span>
            <span>GDG</span>
            <span style={{ opacity: 0.5, fontSize: 56, fontWeight: 400, marginLeft: 8, letterSpacing: -2 }}>MIT-WPU</span>
            <span style={{ color: "#EA4335" }}>]</span>
          </div>
          <div style={{ fontSize: 26, opacity: 0.8, maxWidth: 900, lineHeight: 1.3 }}>
            Workshops • Hackathons • Cloud & AI Study Jams • 6 Collaborative Departments
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.6, fontSize: 16 }}>
          <span>gdg-mitwpu.in</span>
          <span style={{ display: "flex", gap: 12 }}>
            <span style={{ color: "#FBBC04" }}>●</span> Learn
            <span style={{ color: "#EA4335", marginLeft: 12 }}>●</span> Build
            <span style={{ color: "#34A853", marginLeft: 12 }}>●</span> Grow
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
