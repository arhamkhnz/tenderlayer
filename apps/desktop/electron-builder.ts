import type { Configuration } from "electron-builder";

const config: Configuration = {
  appId: "com.electron.tenderlayer",
  productName: "TenderLayer",
  directories: {
    output: "out",
    buildResources: "assets",
  },
  files: ["dist/**", "drizzle/**", "package.json"],
  asar: true,
  asarUnpack: ["**/*.node"],
  allowMissingDependencies: false,
  publish: null,
  electronFuses: {
    runAsNode: false,
    enableCookieEncryption: true,
    enableNodeOptionsEnvironmentVariable: false,
    enableNodeCliInspectArguments: false,
    grantFileProtocolExtraPrivileges: false,
    enableEmbeddedAsarIntegrityValidation: true,
    onlyLoadAppFromAsar: true,
  },
  mac: {
    target: ["dmg", "zip"],
    icon: "assets/tenderlayer.icon",
    artifactName: "TenderLayer-${version}-macos-${arch}.${ext}",
    category: "public.app-category.business",
    // Fuse changes invalidate Electron's original signature; re-sign without a developer certificate.
    identity: "-",
    hardenedRuntime: false,
    notarize: false,
  },
  win: {
    target: ["nsis"],
    icon: "assets/tenderlayer.ico",
    artifactName: "TenderLayer-${version}-windows-${arch}-setup.${ext}",
  },
  nsis: {
    oneClick: true,
    perMachine: false,
  },
  linux: {
    target: ["deb", "rpm"],
    icon: "assets/tenderlayer-macos-legacy.png",
    category: "Office",
  },
};

export default config;
