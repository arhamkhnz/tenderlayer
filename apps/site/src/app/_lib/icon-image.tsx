import { Buffer } from "node:buffer";
import { ImageResponse } from "next/og";

import icon from "@tenderlayer/ui/assets/icon.svg?raw";

const faviconSvg = icon
  .replace(/style="[^"]*"/, 'style="color: #ffffff;"')
  .replace(/ color="[^"]*"/, ' color="#ffffff"');
const logoSource = `data:image/svg+xml;base64,${Buffer.from(faviconSvg).toString("base64")}`;

export function createIconImage(size: number) {
  const iconSize = size * 0.6;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "#000000",
      }}
    >
      <img src={logoSource} alt="" width={iconSize} height={iconSize} />
    </div>,
    { width: size, height: size },
  );
}
