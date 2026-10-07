import { Buffer } from "node:buffer";

import { ImageResponse } from "next/og";

import fontData from "./fonts/og-fonts.json";

export const alt = "TenderLayer: Tender and Contract Management. In development.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Bundle font bytes to avoid runtime filesystem reads on Workers.
const sansRegular = Buffer.from(fontData.sansRegular, "base64");
const sansMedium = Buffer.from(fontData.sansMedium, "base64");
const serifLight = Buffer.from(fontData.serifLight, "base64");

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
        fontFamily: "Timeless Sans",
        fontWeight: 400,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            fontFamily: "Timeless Serif",
            fontSize: 64,
            fontWeight: 300,
            letterSpacing: -3,
            transform: "translateX(-2px)",
          }}
        >
          TenderLayer
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 24,
            fontWeight: 500,
            lineHeight: "32px",
            background: "#ffedd4",
            color: "#ca3500",
            padding: "8px 16px",
            borderRadius: 16,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22C6.47715 22 2 17.5229 2 12M3.90983 6.12215C4.52663 5.2732 5.2732 4.52663 6.12215 3.90983M10.4357 2.12312C11.4721 1.95896 12.5279 1.95896 13.5643 2.12312M17.8778 3.90983C18.7268 4.52663 19.4734 5.2732 20.0902 6.12215M21.8769 10.4357C22.041 11.4721 22.041 12.5279 21.8769 13.5643M20.0902 17.8778C19.4734 18.7268 18.7268 19.4734 17.8778 20.0902" />
          </svg>
          In development
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 52, lineHeight: 1.15, transform: "translateX(-2px)", letterSpacing: -2 }}>
          Tender and Contract Management
        </div>
        <div style={{ fontSize: 26, lineHeight: 1.4, color: "#666666" }}>
          An open-source, local-first desktop app for managing tenders, contracts, employee records, invoices, and
          payroll while keeping business data on your computer.
        </div>
      </div>
      <div style={{ fontSize: 24, color: "#666666" }}>tenderlayer.com</div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Timeless Sans", data: sansRegular, weight: 400, style: "normal" },
        { name: "Timeless Sans", data: sansMedium, weight: 500, style: "normal" },
        { name: "Timeless Serif", data: serifLight, weight: 300, style: "normal" },
      ],
    },
  );
}
