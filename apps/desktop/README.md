# Desktop development

This guide covers local setup and commands for the Electron application. See the [main README](../../README.md) for the project background, current status, roadmap, and contribution guidelines.

## Getting started

Run installation and workspace commands from the repository root.

Requirements:

- Node.js `>=24.11.0`
- npm `11.16.0`

```bash
npm ci
npm run dev:desktop
```

Shared shadcn components, hooks, and theme live in `packages/ui`. To add a component from the repository root:

```bash
npx shadcn@latest add <component> -c apps/desktop
```

## Commands

Run desktop workflows from the repository root:

```bash
npm run dev:desktop      # Start the desktop development environment
npm run dev:renderer     # Start the renderer dev server (requires Electron's preload)
npm run db:generate      # Generate SQLite migrations from the Drizzle schema
npm run db:studio        # Open Drizzle Studio with the local development database
npm run rebuild:native   # Rebuild native dependencies for Electron
npm run check-types -- --filter=@tenderlayer/desktop
npm run lint -- --filter=@tenderlayer/desktop
npm run lint:fix:desktop  # Apply desktop lint fixes
npm run format           # Format the repository with Oxfmt
npm run format:check     # Check repository formatting
npm run fix:desktop      # Apply desktop lint fixes and format desktop
npm run build:desktop    # Build the application
npm run start:desktop    # Run an existing production build
npm run preview:renderer # Serve built renderer assets (requires Electron's preload)
npm run package          # Build and create an unpacked application
npm run make             # Build and create platform distributables
```

Root `package` and `make` commands build through Turbo first. When invoking electron-builder scripts directly inside `apps/desktop`, build the app beforehand.

After packaging, run the smoke test from the repository root:

```bash
node apps/desktop/scripts/smoke-test.mjs
```

It launches a copy of the packaged app with temporary databases to check fresh schema creation and renderer communication. Once the journal includes a migration after the baseline, it also checks upgrades and rollback.
