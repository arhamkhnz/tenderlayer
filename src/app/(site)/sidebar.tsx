"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const githubProfileUrl = "https://github.com/arhamkhnz";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-(--site-top-bar-height) flex h-[calc(100vh-var(--site-content-start))] min-w-0 flex-col gap-4 px-1.5 py-4">
      <nav className="flex flex-col items-start gap-2" aria-label="Primary navigation">
        <Link
          className="relative inline-flex items-center justify-start gap-3.5 text-left text-base text-zinc-600 leading-[1.4] before:absolute before:top-1/2 before:-left-[7px] before:h-4 before:w-px before:-translate-y-1/2 before:bg-transparent before:content-[''] hover:text-zinc-900 aria-[current=page]:before:bg-amber-600"
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          transitionTypes={["nav-back"]}
        >
          Product
        </Link>
        <Link
          className="relative inline-flex items-center justify-start gap-3.5 text-left text-base text-zinc-600 leading-[1.4] before:absolute before:top-1/2 before:-left-[7px] before:h-4 before:w-px before:-translate-y-1/2 before:bg-transparent before:content-[''] hover:text-zinc-900 aria-[current=page]:before:bg-amber-600"
          href="/why"
          aria-current={pathname === "/why" ? "page" : undefined}
          transitionTypes={[pathname === "/roadmap" ? "nav-back" : "nav-forward"]}
        >
          Why TenderLayer
        </Link>
        <Link
          className="relative inline-flex items-center justify-start gap-3.5 text-left text-base text-zinc-600 leading-[1.4] before:absolute before:top-1/2 before:-left-[7px] before:h-4 before:w-px before:-translate-y-1/2 before:bg-transparent before:content-[''] hover:text-zinc-900 aria-[current=page]:before:bg-amber-600"
          href="/roadmap"
          aria-current={pathname === "/roadmap" ? "page" : undefined}
          transitionTypes={["nav-forward"]}
        >
          Roadmap
        </Link>
      </nav>

      <div className="w-[34px] border-zinc-200 border-t" />
      <p className="text-base text-zinc-600 leading-[1.4]">
        by{" "}
        <a className="text-zinc-900" href={githubProfileUrl}>
          arhamkhnz
        </a>
      </p>

      <footer className="fixed bottom-4 text-zinc-500">
        <p className="m-0 max-w-[220px] text-sm leading-[1.5]">
          I’ve seen tender work up close since 2010. TenderLayer grew from that.
        </p>
      </footer>
    </aside>
  );
}
