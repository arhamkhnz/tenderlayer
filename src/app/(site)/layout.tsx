import type { ReactNode } from "react";

const repositoryUrl = "https://github.com/arhamkhnz/tenderlayer";

const navLinkClass =
  "inline-flex min-h-4 items-center gap-[7px] text-[9px] leading-[1.4] transition-[color,transform] duration-150 hover:translate-x-0.5 hover:text-zinc-900 motion-reduce:transition-none min-[1100px]:min-h-8 min-[1100px]:gap-3.5 min-[1100px]:text-lg max-[700px]:text-[13px]";

const navIndexClass =
  "w-3.5 font-mono text-[6px] text-zinc-500 min-[1100px]:w-7 min-[1100px]:text-xs";

export default function SiteLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="grid overflow-x-clip">
      <div
        className="sticky top-8 z-30 col-start-1 row-start-1 mt-[60px] self-start border-t border-zinc-200 min-[1100px]:top-16 min-[1100px]:mt-[120px] max-[700px]:hidden"
        aria-hidden="true"
      />
      <div className="col-start-1 row-start-1 mx-[clamp(24px,4.2vw,64px)] grid min-h-screen grid-cols-[minmax(0,5fr)_minmax(0,8fr)_minmax(0,5fr)] border-x border-dashed border-zinc-200 max-[700px]:m-0 max-[700px]:block max-[700px]:border-0">
        <aside className="sticky top-[-55px] z-30 flex h-screen min-w-0 flex-col gap-[17px] self-start border-r border-dashed border-zinc-200 pt-[65px] min-[1100px]:top-[-110px] min-[1100px]:gap-[34px] min-[1100px]:pt-[130px] max-[700px]:static max-[700px]:h-auto max-[700px]:gap-0 max-[700px]:border-r-0 max-[700px]:border-b max-[700px]:border-solid max-[700px]:border-zinc-200 max-[700px]:p-[22px]">
          <div className="flex flex-col items-start gap-[22px] min-[1100px]:gap-11 max-[700px]:w-full max-[700px]:flex-row max-[700px]:items-center max-[700px]:justify-between max-[700px]:gap-4">
            <a
              className="block w-fit font-serif text-[13px] leading-none tracking-[-0.02em] min-[1100px]:text-[26px] max-[700px]:text-[21px]"
              href="#top"
              aria-label="TenderLayer home"
            >
              TenderLayer
            </a>

            <nav
              className="flex flex-col items-start gap-[5px] min-[1100px]:gap-2.5 max-[700px]:flex-row max-[700px]:gap-4"
              aria-label="Primary navigation"
            >
              <a className={`${navLinkClass} text-zinc-600`} href="#workspace">
                <span className={navIndexClass} aria-hidden="true">01</span>
                Product
              </a>
              <a className={`${navLinkClass} text-zinc-300 max-[700px]:hidden`} href="#story">
                <span className={navIndexClass} aria-hidden="true">02</span>
                Roadmap
                <small className="rounded-sm bg-zinc-100 px-[3px] py-px text-[5px] font-semibold tracking-[0.04em] text-zinc-300 min-[1100px]:px-1.5 min-[1100px]:py-0.5 min-[1100px]:text-[10px]">
                  SOON
                </small>
              </a>
              <a className={`${navLinkClass} text-zinc-600`} href={`${repositoryUrl}/issues/new`}>
                <span className={navIndexClass} aria-hidden="true">03</span>
                Contact
              </a>
            </nav>
          </div>

          <div className="w-[17px] border-t border-zinc-200 min-[1100px]:w-[34px] max-[700px]:hidden" />
          <a
            className="inline-flex min-h-4 items-center text-[9px] leading-[1.4] text-zinc-600 min-[1100px]:min-h-8 min-[1100px]:text-lg max-[700px]:hidden"
            href={repositoryUrl}
          >
            Follow on GitHub
          </a>

          <div
            className="mt-auto grid gap-[5px] pb-[25px] text-zinc-500 min-[1100px]:gap-2.5 min-[1100px]:pb-[50px] max-[700px]:hidden"
            aria-label="Project details"
          >
            <p className="m-0 grid grid-cols-[34px_auto] text-[7px] leading-[1.4] min-[1100px]:grid-cols-[68px_auto] min-[1100px]:text-sm">
              <span className="font-mono">Data</span>
              Stored locally
            </p>
            <p className="m-0 grid grid-cols-[34px_auto] text-[7px] leading-[1.4] min-[1100px]:grid-cols-[68px_auto] min-[1100px]:text-sm">
              <span className="font-mono">Source</span>
              Open on GitHub
            </p>
          </div>
        </aside>

        <main className="min-w-0 border-r border-dashed border-zinc-200 max-[700px]:border-r-0">
          {children}
        </main>

        <div className="min-w-0 max-[700px]:hidden" aria-hidden="true" />
      </div>
    </div>
  );
}
