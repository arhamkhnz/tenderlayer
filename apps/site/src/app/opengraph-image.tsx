import { Buffer } from "node:buffer";

import { ImageResponse } from "next/og";

import { productCategory, seoDescription, seoTitle } from "./_lib/product-metadata";
import fontData from "./fonts/og-fonts.json";

export const alt = seoTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Bundle font bytes to avoid runtime filesystem reads on Workers.
const sansRegular = Buffer.from(fontData.sansRegular, "base64");
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
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 52, lineHeight: 1.15, transform: "translateX(-2px)", letterSpacing: -2 }}>
          {productCategory}
        </div>
        <div style={{ fontSize: 26, lineHeight: 1.4, color: "#666666" }}>{seoDescription}</div>
      </div>
      <div style={{ fontSize: 24, color: "#666666" }}>tenderlayer.com</div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Timeless Sans", data: sansRegular, weight: 400, style: "normal" },
        { name: "Timeless Serif", data: serifLight, weight: 300, style: "normal" },
      ],
    },
  );
}
