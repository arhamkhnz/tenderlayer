import { Suspense } from "react";

import { CircleProgressQuarter } from "@keyline-icons/react";

import GitHubStarCount from "./github-star-count";

export default function IntroSection({ repositoryUrl }: { repositoryUrl: string }) {
  return (
    <section className="flex flex-col gap-4" aria-label="About TenderLayer">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="w-fit -translate-x-0.5 font-light font-serif text-3xl leading-none tracking-[-0.08em] [font-variation-settings:'STYL'_100]">
            TenderLayer
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-100 px-2 py-1 font-medium text-orange-700 text-xs leading-4">
            <CircleProgressQuarter className="size-3.5 shrink-0" aria-hidden="true" />
            In development
          </span>
        </div>
        <a className="group inline-flex shrink-0 items-center gap-2" href={repositoryUrl}>
          <img
            className="opacity-75 group-hover:opacity-100"
            src="/logo/gh.svg"
            alt="TenderLayer on GitHub"
            width={24}
            height={24}
          />
          <Suspense fallback={null}>
            <GitHubStarCount />
          </Suspense>
        </a>
      </header>
      <p className="text-pretty font-normal text-muted leading-6">
        An open-source, local-first desktop app for managing tenders and contracts, designed to keep your business data
        on your computer.
      </p>
    </section>
  );
}
