# Shared UI

Desktop UI components, the mobile hook, and theme are copied here while the desktop app continues to use its local files.

The package uses Base UI, shadcn's Mira style, and Phosphor icons. Its CSS includes the desktop's Geist, Geist Mono, and Instrument Serif fonts.

```tsx
import { Button } from "@repo/ui/components/button";
import { useIsMobile } from "@repo/ui/hooks/use-mobile";
import { cn } from "@repo/ui/lib/utils";
import "@repo/ui/globals.css";
```

To add a component directly to this package from the repository root:

```sh
npx shadcn@latest add <component> -c packages/ui
```

Consuming apps must declare `@repo/ui` as a workspace dependency and configure their bundler to process its TypeScript source. App-level shadcn aliases can be migrated when the desktop starts consuming this package.
