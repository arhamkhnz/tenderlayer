import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const assetsDirectory = fileURLToPath(new URL("./assets/", import.meta.url));

const config = {
  packagerConfig: {
    asar: true,
    icon: "assets/tenderlayer",
    ignore: [
      /^\/\.data(?:\/|$)/,
      /^\/(?:src|scripts)(?:\/|$)/,
      /^\/(?:README\.md|drizzle\.config\.ts|forge\.config\.ts)$/,
      /^\/tsconfig(?:\..+)?\.json$/,
      /^\/vite(?:\..+)?\.config\.ts$/,
    ],
  },
  rebuildConfig: {},
  hooks: {
    prePackage: async (_config: unknown, platform: string) => {
      if (platform !== "darwin" && platform !== "mas") return;

      const source = path.join(assetsDirectory, "tenderlayer-macos-legacy.png");
      const png = await readFile(source);
      if (
        png.length < 24 ||
        png.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" ||
        png.readUInt32BE(16) !== 1024 ||
        png.readUInt32BE(20) !== 1024
      ) {
        throw new Error("The pre-Tahoe macOS icon must be a 1024×1024 PNG.");
      }

      const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "tenderlayer-icon-"));

      try {
        const iconset = path.join(temporaryDirectory, "tenderlayer.iconset");
        const output = path.join(temporaryDirectory, "tenderlayer.icns");
        await mkdir(iconset);
        for (const size of [16, 32, 128, 256, 512]) {
          for (const scale of [1, 2]) {
            const pixels = String(size * scale);
            const filename = `icon_${size}x${size}${scale === 2 ? "@2x" : ""}.png`;
            await run("sips", ["-z", pixels, pixels, source, "--out", path.join(iconset, filename)]);
          }
        }
        await run("iconutil", ["-c", "icns", iconset, "-o", output]);

        const icon = await readFile(output);
        if (icon.toString("ascii", 0, 4) !== "icns") {
          throw new Error("iconutil did not generate a valid macOS ICNS fallback.");
        }
        await writeFile(path.join(assetsDirectory, "tenderlayer.icns"), icon);
      } finally {
        await rm(temporaryDirectory, { recursive: true, force: true });
      }
    },
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "TenderLayer",
        setupIcon: "assets/tenderlayer.ico",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-dmg",
      platforms: ["darwin"],
      config: {
        format: "ULFO",
      },
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.GrantFileProtocolExtraPrivileges]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
