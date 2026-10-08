# Shared UI

Shared UI components, the mobile hook, and theme used by the desktop app.

The package uses Base UI, shadcn's Mira style, and Phosphor icons. Its CSS includes the desktop's Geist, Geist Mono, and Instrument Serif fonts.

```tsx
import { Button } from "@tenderlayer/ui/components/button";
import { useIsMobile } from "@tenderlayer/ui/hooks/use-mobile";
import { cn } from "@tenderlayer/ui/lib/utils";
import "@tenderlayer/ui/globals.css";
```

The shared stylesheet registers this package's sources and the desktop app's sources. The landing site uses its own stylesheet.

To add a component directly to this package from the repository root:

```sh
npx shadcn@latest add <component> -c packages/ui
```

The desktop app declares `@tenderlayer/ui` as a workspace dependency and uses Vite to process its TypeScript source. Its shadcn aliases target this package, so components added through the desktop app are installed here.
