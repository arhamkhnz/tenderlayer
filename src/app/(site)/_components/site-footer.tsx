import { ArrowUpRight } from "@keyline-icons/react";

export default function SiteFooter({ repositoryUrl }: { repositoryUrl: string }) {
  return (
    <footer className="flex flex-col gap-2 border-rule border-t pt-6 font-normal text-base leading-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-pretty text-muted sm:flex-1">Have an idea or a requirement?</p>
        <a
          className="inline-flex w-fit shrink-0 items-center gap-1 text-foreground underline decoration-rule underline-offset-4 transition-colors hover:decoration-foreground"
          href={`${repositoryUrl}/issues/new`}
        >
          Share on GitHub
          <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
        </a>
      </div>
      <p className="mt-2 text-muted text-sm leading-5">
        Built by{" "}
        <a
          className="underline decoration-rule underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          href="https://github.com/arhamkhnz"
        >
          arhamkhnz
        </a>
      </p>
    </footer>
  );
}
