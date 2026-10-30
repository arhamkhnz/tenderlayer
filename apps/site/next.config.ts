import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.svg": {
        condition: { query: "?raw" },
        loaders: [fileURLToPath(new URL("./loaders/svg-source.cjs", import.meta.url))],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
