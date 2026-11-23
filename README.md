<p align="center">
  <img src="apps/desktop/assets/tenderlayer-macos-legacy.png" alt="TenderLayer logo" width="96" height="96" />
</p>

<h1 align="center">TenderLayer</h1>

<p align="center">Manage tenders, contracts, employees, and finances in one workspace.</p>

<p align="center">
  <a href="https://github.com/arhamkhnz/tenderlayer/releases">Download</a> ·
  <a href="https://tenderlayer.com">Website</a> ·
  <a href="https://github.com/arhamkhnz/tenderlayer/issues">Report an issue</a>
</p>

<p align="center">
  <img src="docs/assets/dashboard.png" alt="TenderLayer dashboard with sample data" />
</p>

## Why TenderLayer

Running a business around tenders involves more than submitting bids. Each awarded contract brings locations, employees, payroll, invoices, and deadlines to manage. TenderLayer is being built to connect that work in one place, reducing the need to track it across spreadsheets and separate tools.

The project grew out of my family's outsourcing business in India. We tried free and paid tools, and I built an early web version myself. TenderLayer builds on that experience, with a desktop app that keeps business data on your computer.

## Current status

TenderLayer is in early alpha. Several screens still use sample data, and some forms are previews. The dashboard screenshot above shows demonstration data.

The first phase focuses on work after a tender has been awarded:

- **Departments and contracts:** contract details, locations, dates, and the departments they belong to.
- **Employees:** employee records, contract assignments, site locations, and monthly wages.
- **Finance:** payroll, payslips, invoices, purchases, GST details, and payment tracking.
- **Records:** documents, notes, deadlines, and contract history.

These features are being developed and are not all functional yet.

## Roadmap

- **Upcoming bids:** tender opportunities, eligibility checks, bid preparation, submission tracking, and outcomes.
- **Agent:** help with routine tasks and tender preparation, with human review before critical declarations or submissions.
- **Sync and collaboration:** optional cloud and local network sync, shared access, and backups.

## Download

Download a testing build from [GitHub Releases](https://github.com/arhamkhnz/tenderlayer/releases):

- **macOS:** Apple Silicon (arm64), available as DMG and ZIP.
- **Windows:** x64 installer.

The macOS builds are not notarized, and Windows installers are unsigned, so your operating system may show a security warning.

## Development

Requires Node.js `>=24.11.0` and npm `11.16.0`.

```sh
git clone https://github.com/arhamkhnz/tenderlayer.git
cd tenderlayer
npm ci
npm run dev:desktop
```

To work on the website, run `npm run dev:site`. See the [desktop guide](apps/desktop/README.md#getting-started) and [website guide](apps/site/README.md#getting-started) for more setup details and commands.

## Contributing

Bug reports, feedback, and pull requests are welcome. For larger changes, open an issue first so we can discuss the approach. Keep pull requests focused and explain what changed and how you checked it.
