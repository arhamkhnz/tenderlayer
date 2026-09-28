import type { ReactNode } from "react";

const repositoryUrl = "https://github.com/arhamkhnz/tenderlayer";

const navLinkClass =
  "inline-flex min-h-4 items-center gap-[7px] text-[9px] leading-[1.4] text-zinc-600 transition-[color,transform] duration-150 hover:translate-x-0.5 hover:text-zinc-900 motion-reduce:transition-none min-[1100px]:min-h-8 min-[1100px]:gap-3.5 min-[1100px]:text-lg max-[700px]:text-[13px]";

const navIndexClass =
  "w-3.5 [font-family:var(--font-geist-mono)] text-[6px] text-zinc-400 min-[1100px]:w-7 min-[1100px]:text-xs";

export default function SiteLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-zinc-50 text-zinc-900 before:pointer-events-none before:absolute before:inset-x-0 before:top-[60px] before:h-px before:bg-cyan-50 before:content-[''] min-[1100px]:before:top-[120px] max-[700px]:before:hidden">
      <a
        className="fixed top-4 left-4 z-20 -translate-y-[180%] bg-zinc-900 px-3.5 py-2.5 text-white focus:translate-y-0 focus:outline-2 focus:outline-offset-2 focus:outline-sky-500"
        href="#main-content"
      >
        Skip to content
      </a>

      <div className="mx-[4.2%] grid min-h-screen grid-cols-[minmax(0,5fr)_minmax(0,8fr)_minmax(0,5fr)] border-x border-dashed border-zinc-200 max-[700px]:m-0 max-[700px]:block max-[700px]:border-0">
        <aside className="sticky top-0 flex h-screen min-w-0 flex-col self-start border-r border-dashed border-zinc-200 pt-[65px] min-[1100px]:pt-[130px] max-[700px]:static max-[700px]:h-auto max-[700px]:flex-row max-[700px]:items-center max-[700px]:justify-between max-[700px]:border-r-0 max-[700px]:border-b max-[700px]:border-solid max-[700px]:border-zinc-200 max-[700px]:p-[22px]">
          <a
            className="block w-fit [font-family:var(--font-instrument-serif)] text-[13px] leading-none tracking-[-0.02em] min-[1100px]:text-[26px] max-[700px]:text-[21px]"
            href="#top"
            aria-label="TenderLayer home"
          >
            TenderLayer
          </a>

          <nav
            className="mt-[22px] flex flex-col items-start gap-[5px] min-[1100px]:mt-11 min-[1100px]:gap-2.5 max-[700px]:mt-0 max-[700px]:flex-row max-[700px]:gap-4"
            aria-label="Primary navigation"
          >
            <a className={navLinkClass} href="#workspace">
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
            <a className={navLinkClass} href={`${repositoryUrl}/issues/new`}>
              <span className={navIndexClass} aria-hidden="true">03</span>
              Contact
            </a>
          </nav>

          <div className="mt-[17px] w-[17px] border-t border-zinc-200 min-[1100px]:mt-[34px] min-[1100px]:w-[34px] max-[700px]:hidden" />
          <a
            className="mt-[17px] inline-flex min-h-4 items-center text-[9px] leading-[1.4] text-zinc-600 min-[1100px]:mt-[34px] min-[1100px]:min-h-8 min-[1100px]:text-lg max-[700px]:hidden"
            href={repositoryUrl}
          >
            Follow on GitHub
          </a>

          <div
            className="mt-auto grid gap-[5px] pb-[25px] min-[1100px]:gap-2.5 min-[1100px]:pb-[50px] max-[700px]:hidden"
            aria-label="Project details"
          >
            <p className="m-0 grid grid-cols-[34px_auto] text-[7px] leading-[1.4] text-zinc-500 min-[1100px]:grid-cols-[68px_auto] min-[1100px]:text-sm">
              <span className="[font-family:var(--font-geist-mono)] text-zinc-400">Data</span>
              Stored locally
            </p>
            <p className="m-0 grid grid-cols-[34px_auto] text-[7px] leading-[1.4] text-zinc-500 min-[1100px]:grid-cols-[68px_auto] min-[1100px]:text-sm">
              <span className="[font-family:var(--font-geist-mono)] text-zinc-400">Source</span>
              Open on GitHub
            </p>
          </div>
        </aside>

        <main
          className="min-w-0 border-r border-dashed border-zinc-200 outline-none max-[700px]:border-r-0"
          id="main-content"
          tabIndex={-1}
        >
          {children}
        </main>

        <div className="min-w-0 max-[700px]:hidden" aria-hidden="true" />
      </div>
    </div>
  );
}
