import type { ReactNode } from "react";

export default function SiteLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="mx-auto min-h-dvh max-w-152 px-6 pt-30 pb-20 [&_a:focus-visible]:outline [&_a:focus-visible]:outline-foreground [&_a:focus-visible]:outline-offset-4">
      {children}
    </div>
  );
}
