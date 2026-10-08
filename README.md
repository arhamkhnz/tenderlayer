# TenderLayer

TenderLayer contains the desktop application and landing site in an npm workspace managed by Turborepo.

## Repository structure

- [apps/desktop](apps/desktop): Electron, React, and Vite desktop application. Its README covers the product and desktop development.
- [apps/site](apps/site): Next.js landing site for [tenderlayer.com](https://tenderlayer.com).
- [packages/ui](packages/ui): Shared shadcn components, hooks, utilities, and theme copied from the desktop app. Desktop integration is pending.
- `packages/typescript-config`: Shared TypeScript configurations.

Oxlint and Oxfmt are configured at the repository root.

## Development

Run commands from the repository root. To start the site:

```sh
npm run dev -- --filter=tenderlayer-site
```

To start the desktop app:

```sh
npm run dev --workspace apps/desktop
```

To build the site or check its types:

```sh
npm run build -- --filter=tenderlayer-site
npm run check-types -- --filter=tenderlayer-site
```

## Monorepo migration

Dependency installation and lockfile consolidation are pending. Cloudflare deployment settings also need to target `apps/site`.
