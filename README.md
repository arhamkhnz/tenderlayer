# TenderLayer

TenderLayer contains the desktop application and landing site in an npm workspace managed by Turborepo.

## Repository structure

- [apps/desktop](apps/desktop): Electron, React, and Vite desktop application. Its README covers the product and desktop development.
- [apps/site](apps/site): Next.js landing site for [tenderlayer.com](https://tenderlayer.com).
- [packages/ui](packages/ui): Shared shadcn components, hooks, utilities, and theme used by the desktop app.

Oxlint and Oxfmt are configured at the repository root.

## Commands

Run commands from the repository root:

```sh
npm run dev              # Start desktop and site
npm run dev:desktop      # Start Electron desktop development
npm run dev:site         # Start the landing site
npm run dev:renderer     # Start the desktop renderer in a browser
npm run build            # Build desktop and site
npm run build:desktop    # Build desktop only
npm run build:site       # Build site only
npm run start:desktop    # Run an existing desktop production build
npm run start:site       # Serve an existing site production build
npm run preview:renderer # Preview the built desktop renderer
npm run check-types      # Check all workspace types
npm run lint             # Lint all workspaces
npm run lint:fix:desktop  # Apply desktop lint fixes
npm run fix:desktop       # Apply desktop lint fixes and format desktop
npm run format           # Format the repository
npm run format:check     # Check repository formatting
npm run fix              # Apply repository-wide lint fixes, then format
```

Desktop database and packaging workflows:

```sh
npm run db:generate      # Generate SQLite migrations
npm run db:studio        # Open Drizzle Studio
npm run rebuild:native   # Rebuild native dependencies for Electron
npm run package          # Build and create an unpacked desktop app
npm run make             # Build and create desktop installers
```

App scripts remain in their workspace packages. Root commands delegate through Turbo; formatting runs centrally through Oxfmt. Packaging and installer tasks depend on the desktop build. Database tools, native rebuilds, and packaging run without caching.

## Deployment

Cloudflare deployment settings need to target `apps/site`.
