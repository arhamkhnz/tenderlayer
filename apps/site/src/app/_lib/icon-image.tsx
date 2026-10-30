import { Buffer } from "node:buffer";
import { ImageResponse } from "next/og";

import roundedLogo from "@tenderlayer/ui/assets/tenderlayer-rounded.svg?raw";

const logoSource = `data:image/svg+xml;base64,${Buffer.from(roundedLogo).toString("base64")}`;

export function createIconImage(size: number) {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        // Matches the site's --foreground: oklch(26.9% 0 none).
        background: "#262626",
      }}
    >
      <img src={logoSource} alt="" width={size} height={size} />
    </div>,
    { width: size, height: size },
  );
}
