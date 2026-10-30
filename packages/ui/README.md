# Shared UI

Shared UI components, SVG assets, the mobile hook, and theme used by the desktop app and landing site.

The package uses Base UI, shadcn's Mira style, and Phosphor icons. Its theme uses Timeless Sans, Timeless Serif, and Paper Mono from `@tenderlayer/fonts`. Paper Mono uses one variable WOFF2 file supporting weights 100–800 for monospace text.

```tsx
import { Button } from "@tenderlayer/ui/components/button";
import { useIsMobile } from "@tenderlayer/ui/hooks/use-mobile";
import { cn } from "@tenderlayer/ui/lib/utils";
import "@tenderlayer/fonts/fonts.css";
import "@tenderlayer/ui/globals.css";
```

The shared stylesheet registers this package's sources and the desktop app's sources. The landing site imports it directly in its root layout and uses the same theme.

Shared SVGs live in `src/assets` and are exported through `@tenderlayer/ui/assets/*`. Keep the originals here instead of copying them into each app.

```tsx
import roundedLogo from "@tenderlayer/ui/assets/tenderlayer-rounded.svg";
```

In the Next.js site, use the imported asset's `.src` as the `<img>` source. In the Vite desktop renderer, the import is an image URL for an `<img>` element. The sharp variant is available as `@tenderlayer/ui/assets/tenderlayer-sharp.svg`.

To add a component directly to this package from the repository root:

```sh
npx shadcn@latest add <component> -c packages/ui
```

The desktop app declares `@tenderlayer/ui` as a workspace dependency and uses Vite to process its TypeScript source. Its shadcn aliases target this package, so components added through the desktop app are installed here.
