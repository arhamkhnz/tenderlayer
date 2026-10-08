# TenderLayer site

The [Next.js](https://nextjs.org) landing site for [TenderLayer](https://tenderlayer.com).

## Getting started

From the repository root, run the development server:

```sh
npm run dev:site
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The landing page is `src/app/(site)/page.tsx`. SEO metadata is in `src/app/layout.tsx`.

## Fonts

This project uses `next/font/local` to load the unmodified Timeless Sans and Serif variable fonts. These proprietary assets are covered by [their license](src/app/fonts/LICENSE.pdf), not the project's open-source license.

The maintainer received this clarification from the licensor about including font assets in a public project repository:

> That should be okay. That wouldn’t be redistributing from your end as long as that’s not the sole purpose and it’s part of a larger project.

Obtain fonts for other projects from [Timeless](https://www.timeless.co/type).
