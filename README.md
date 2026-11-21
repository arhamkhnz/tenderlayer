# TenderLayer

TenderLayer contains the desktop application and landing site in an npm workspace managed by Turborepo.

## Repository structure

- [apps/desktop](apps/desktop): Electron, React, and Vite desktop application. Its README covers the product and desktop development.
- [apps/site](apps/site): Next.js landing site for [tenderlayer.com](https://tenderlayer.com).
- [packages/ui](packages/ui): Shared shadcn components, hooks, utilities, and theme used by the desktop app.

Oxlint and Oxfmt are configured at the repository root.

Development requires Node.js `>=24.11.0` and npm `11.16.0`.

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

App scripts remain in their workspace packages. Root commands delegate through Turbo; formatting runs centrally through Oxfmt. The root `fix` command runs workspace lint fixes and a separate root TypeScript lint-fix task through Turbo before formatting. Packaging and installer tasks depend on the desktop build. Database tools, native rebuilds, and packaging run without caching.

## Deployment

Cloudflare deployment settings need to target `apps/site`.

## CI

The **Checks** workflow runs on pull requests and pushes to `main`, and can also be started manually or called by the release workflow. It installs dependencies, checks formatting with Oxfmt, runs Oxlint and TypeScript checks, and builds the desktop app and website using the existing workspace scripts. It does not package installers or publish releases.

## Desktop releases

The **Publish** GitHub Actions workflow builds unsigned macOS DMG and ZIP installers for Apple Silicon (`arm64`) and a Windows installer (`x64`). Windows artifacts also include the Squirrel `.nupkg` and `RELEASES` files. It runs manually, when the version in `apps/desktop/package.json` changes on `main`, or when a version tag is pushed. Other package changes do not start installer builds.

For a test build, open **Actions → Publish → Run workflow**, select a branch, and run it. Download the platform-specific installers from the completed run's **Artifacts** section. Workflow artifacts are retained for 14 days. The workflow must be present on the default branch before the manual trigger is available.

For a testing release, bump the desktop version and commit both the manifest and lockfile. For example:

```sh
npm version 0.1.0-beta.1 --workspace=@tenderlayer/desktop --no-git-tag-version --ignore-scripts
git add apps/desktop/package.json package-lock.json
git commit -m "chore: release desktop v0.1.0-beta.1"
git push origin main
```

The workflow calls CI for the same commit while the macOS and Windows builds run in parallel. Publishing requires CI and both platform builds to succeed. It then creates the matching Git tag at the built commit, attaches all platform artifacts, and publishes a **GitHub pre-release**. These release assets stay available until the release or assets are deleted; the 14-day workflow artifact retention does not apply to them. Users can download the installers from the repository's **Releases** page. Installers are not committed into Git.

Pushing an explicit tag such as `v0.1.0-beta.1` also builds and publishes a pre-release, using the tag's version inside the runner without committing manifest changes. Manual runs only upload workflow artifacts and do not publish releases. All automated releases are marked as pre-releases while builds remain unsigned, even if the version has no `beta` suffix. Re-running a published release keeps its existing assets; use a new version for updated builds. Existing tags pointing to a different commit are never moved.

These builds are unsigned, and the macOS build is not notarized, so macOS Gatekeeper or Windows SmartScreen may display warnings. No signing secrets are needed. The workflow uses the repository's automatic `GITHUB_TOKEN` to create tags and publish pre-releases.
