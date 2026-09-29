import type { ReactNode } from "react";

import { StarIcon } from "@phosphor-icons/react/dist/ssr/Star";

import { getStargazerCount } from "./_lib/github";
import Sidebar from "./sidebar";

const repositoryUrl = "https://github.com/arhamkhnz/tenderlayer";

export default async function SiteLayout({ children }: Readonly<{ children: ReactNode }>) {
  const stargazerCount = await getStargazerCount();
  const formattedStargazerCount =
    stargazerCount < 10 ? String(stargazerCount).padStart(2, "0") : stargazerCount.toLocaleString("en-US");

  return (
    <div className="grid min-w-(--site-min-width) grid-cols-[var(--site-gutter)_minmax(0,5fr)_minmax(0,8fr)_minmax(0,5fr)_var(--site-gutter)]">
      <header className="sticky top-0 z-40 col-span-full row-start-1 mt-(--site-top-bar-start) grid h-(--site-top-bar-height) grid-cols-subgrid self-start border-zinc-200 border-y bg-zinc-50">
        <div className="col-start-2 grid items-center border-zinc-200 border-x border-dashed p-1">
          <a
            className="w-fit font-serif text-3xl leading-none tracking-tight"
            href="#top"
            aria-label="TenderLayer home"
          >
            TenderLayer
          </a>
        </div>

        <div className="col-start-3 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-6 border-zinc-200 border-r border-dashed p-1 text-base text-zinc-500 leading-[1.4]">
          <p className="whitespace-nowrap"></p>
          <a
            className="flex items-center gap-1.25 whitespace-nowrap tabular-nums hover:text-zinc-900"
            href={repositoryUrl}
            aria-label={`GitHub, ${stargazerCount.toLocaleString("en-US")} stars`}
          >
            <StarIcon className="size-4" weight="fill" aria-hidden="true" />
            {formattedStargazerCount} on GitHub
          </a>
        </div>

        <div className="col-start-4 border-zinc-200 border-r border-dashed" aria-hidden="true" />
      </header>

      <div className="col-start-2 row-start-1 min-h-screen min-w-0 border-zinc-200 border-x border-dashed pt-(--site-content-start)">
        <Sidebar />
      </div>

      <main
        className="col-start-3 row-start-1 min-h-screen min-w-0 border-zinc-200 border-r border-dashed pt-(--site-content-start)"
        id="main-content"
      >
        {children}
      </main>

      <div className="col-start-4 row-start-1 min-h-screen border-zinc-200 border-r border-dashed" aria-hidden="true" />
    </div>
  );
}
