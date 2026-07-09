# Electron Vite Starter

A minimal foundation for building Electron applications with React, TypeScript, and Vite.

The project uses Electron directly. It does not use `electron-vite`, `vite-plugin-electron`, or Electron Forge's Vite plugin. The build and development workflow stays visible in the repository instead of being hidden behind an Electron-specific wrapper.

This starter provides the application infrastructure. It does not prescribe routing, state management, databases, authentication, telemetry, or product architecture.

## Architecture

Electron's process boundaries are kept explicit:

- `src/main` owns application lifecycle, windows, IPC handlers, and privileged operations.
- `src/preload` exposes a narrow API to the renderer through `contextBridge`.
- `src/renderer` contains the React/Vite app.
- `src/shared` contains IPC contracts and types shared across processes.

Each process has a separate Vite configuration:

- `vite.config.ts` builds the React renderer.
- `vite.main.config.ts` builds the Electron main process.
- `vite.preload.config.ts` builds the preload script.

Build output is written to `dist/`:

```text
dist/
├── main/
├── preload/
└── renderer/
```

Source is organized like this:

```text
src/
├── main/
│   └── index.ts
├── preload/
│   ├── index.d.ts
│   └── index.ts
├── renderer/
│   ├── index.html
│   ├── public/
│   └── src/
└── shared/
    └── ipc.ts
```

## Requirements

- Node.js `^20.19.0 || >=22.12.0`
- npm

## Getting started

Install dependencies:

```bash
npm install
```

Start the development environment:

```bash
npm run dev
```

This starts the Vite renderer server, watches the main and preload processes, and launches Electron. Renderer changes use HMR. Main-process changes restart Electron, while preload changes reload the renderer. Stopping the command also stops its child processes.

## Commands

```bash
npm run dev               # Start the complete development environment
npm run dev:renderer      # Start only the renderer in a browser
npm run typecheck         # Check TypeScript
npm run lint              # Run Oxlint
npm run build             # Build main, preload, and renderer
npm start                 # Run Electron from an existing production build
npm run package           # Build and create an unpacked application
npm run make              # Build and create platform distributables
```

Forge writes packaged applications and distributable files to `out/`.

## Packaging

Electron Forge is used only for distribution. It does not control the development server or compile the application source.

The current makers produce:

- Windows: Squirrel installer
- macOS: ZIP and DMG
- Linux: deb and RPM packages

Create distributables for the current platform:

```bash
npm run make
```

Create macOS distributables explicitly:

```bash
npm run make -- --platform=darwin
```

Some distributables require platform-specific tools and should be built on their target operating system. Code signing, macOS notarization, and publishing are not configured yet.

## Security baseline

The current setup includes:

- renderer sandboxing
- context isolation
- disabled Node.js integration in the renderer
- a narrow, typed `contextBridge` API
- IPC sender and argument validation
- navigation and new-window restrictions
- a renderer Content Security Policy
- a custom production protocol instead of `file://`
- ASAR packaging
- restrictive Electron fuses for packaged applications

The renderer does not receive direct access to `ipcRenderer`, Node.js, the filesystem, or other privileged Electron APIs. Add new capabilities through a typed preload API and validate every request in the main process.

## Key decisions

### Use Electron directly

Electron-specific Vite wrappers reduce setup work, but they also own important parts of the development and build workflow. This starter keeps those parts as ordinary scripts and Vite configuration files that can be read, changed, and debugged directly.

### Use Vite for all compilation

Vite builds the renderer, main process, and preload script through separate configurations. The separation keeps their targets and module formats clear without adding another compiler such as esbuild.

### Own development orchestration

`scripts/dev.mjs` coordinates Vite, Electron, rebuilds, restarts, and shutdown. The renderer still uses the normal `vite.config.ts`, with its app root set to `src/renderer`.

### Keep Forge focused on distribution

Forge handles packaging, installers, Electron fuses, and future signing or publishing work. It is not involved in the application development loop.

### Keep IPC narrow and typed

IPC channel names, arguments, results, and the renderer-facing API are defined centrally. The included `ping` method is a small example of the pattern new application APIs should follow.

### Leave product choices to the application

The starter deliberately excludes application-level libraries and architecture. Separate variants can add tools such as Drizzle without making them requirements for every Electron application.

### Keep React Compiler optional

React Compiler is not enabled by default. Applications can add it when its optimization benefits justify the additional compilation work.
