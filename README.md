# TenderLayer

TenderLayer is an open-source, local-first desktop application for managing tender and bid operations. It brings ongoing tenders, upcoming opportunities, application progress, and historical records into one workspace.

> TenderLayer is in early development. The first phase focuses on managing active tenders and contracts.

## Why I am building it

My father runs an outsourcing agency that primarily handles government and private-sector contracts across India, with many tenders sourced through the Government e-Marketplace (GeM) and state-specific procurement portals. Managing more than 500 employees and over 70 active contracts every month has become a tedious task.

We tried free & paid tools, and I also built a web version during the early days of my career. However, this workflow does not need to depend entirely on a web application. TenderLayer is my attempt to build a focused desktop application that keeps day-to-day tender and contract management simple and local-first.

## Development plan

### Phase 1: Ongoing tenders and contracts

The first phase focuses on managing active work after a tender has been awarded:

- Tender and contract details
- Employee records and contract assignments
- Invoice generation and payment status
- Tax and GST details
- Payroll and payslip records
- Documents, notes, deadlines, and contract history

### Phase 2: Upcoming bids

The second phase will focus on opportunities the organization is planning to apply for:

- Upcoming tender and bid opportunities
- Eligibility and requirement tracking
- Go or no-go decisions
- Bid preparation and submission status
- Important dates, documents, and reminders
- Submitted, won, lost, and archived bid history

## Planned features

- Optional cloud and local network sync
- Role-based access control (RBAC)
- Multi-user workspaces and collaboration
- Automated backups, import, and export
- Notifications and deadline reminders
- Reports and operational dashboards
- Country-specific tax support, including GST, VAT, and other regional tax requirements
- Optional procurement portal integrations
- An autonomous bid agent for preparing and submitting tender applications automatically

## Foundation

TenderLayer is built on [Electron Vite Starter](https://github.com/arhamkhnz/electron-vite-starter). Refer to the starter repository for details about the Electron architecture, development workflow, security baseline, and packaging setup.

## Getting started

Requirements:

- Node.js `^22.18.0 || >=24.11.0`
- npm

```bash
npm install
npm run dev
```

## Commands

```bash
npm run dev               # Start the desktop development environment
npm run dev:renderer      # Start only the renderer in a browser
npm run typecheck         # Check TypeScript
npm run lint              # Check code with Oxlint
npm run lint:fix          # Apply safe Oxlint fixes
npm run format            # Format files with Oxfmt
npm run format:check      # Check formatting
npm run fix               # Apply safe lint fixes and format files
npm run build             # Build the application
npm start                 # Run an existing production build
npm run package           # Create an unpacked application
npm run make              # Create platform distributables
```

## Contributions

Contributions are welcome. Feel free to open an issue or reach out to me if you have a specific requirement, use case, or idea for TenderLayer.
