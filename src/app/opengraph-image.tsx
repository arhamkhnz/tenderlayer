import { ImageResponse } from "next/og";

export const alt = "TenderLayer: A local-first workspace for tenders and contracts. In development.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 80,
        background: "white",
        color: "#282828",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -3 }}>TenderLayer</div>
        <div
          style={{
            fontSize: 22,
            background: "#ffedd5",
            color: "#c2410c",
            padding: "12px 18px",
            borderRadius: 12,
          }}
        >
          In development
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 52, lineHeight: 1.15 }}>
          A local-first workspace for tenders and contracts
        </div>
        <div style={{ fontSize: 26, lineHeight: 1.4, color: "#666666" }}>
          An open-source, local-first desktop app for managing tenders, contracts, employee records,
          invoices, and payroll while keeping business data on your computer.
        </div>
      </div>
      <div style={{ fontSize: 24, color: "#666666" }}>tenderlayer.com</div>
    </div>,
    size,
  );
}
