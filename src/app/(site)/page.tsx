import { ArrowDownIcon } from "@phosphor-icons/react/dist/ssr/ArrowDown";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";

import SectionHeading from "./_components/section-heading";

const repositoryUrl = "https://github.com/arhamkhnz/tenderlayer";

const workspaceGroups = [
  {
    index: "01",
    title: "Tenders",
    items: ["Discovery", "Bid preparation", "Documents", "Deadlines"],
  },
  {
    index: "02",
    title: "Operations",
    items: ["Employee records", "Assignments", "Active contracts", "Contract history"],
  },
  {
    index: "03",
    title: "Finance",
    items: ["Payroll", "Invoices", "Payslips", "Your workflow"],
  },
] as const;

export default function Home() {
  return (
    <>
      <section
        className="flow-root min-h-[calc(100vh-var(--site-top-bar-start)-var(--site-top-bar-height))] px-1 py-3.5"
        id="top"
      >
        <div className="flex flex-col gap-3">
          <h1 className="font-normal text-5xl leading-none tracking-tight">
            Manage tenders
            <br />
            from bid to payment.
          </h1>

          <p className="text-xl text-zinc-600 leading-normal">
            An open-source, local-first workspace that keeps contracts, people, payroll, invoices, and records
            connected.
          </p>
        </div>

        <div className="mt-[60px] flex items-center gap-[38px]">
          <a
            className="inline-flex min-h-[58px] items-center justify-center rounded-md border border-zinc-800 bg-zinc-800 px-6 font-medium text-lg text-white shadow-sm transition-colors duration-150 hover:bg-transparent hover:text-zinc-900 motion-reduce:transition-none"
            href={repositoryUrl}
          >
            View on GitHub
          </a>
          <a
            className="inline-flex min-h-[58px] items-center justify-center gap-3 border-transparent border-b font-medium text-amber-700 text-lg transition-colors duration-150 hover:border-current motion-reduce:transition-none"
            href="#workspace"
          >
            <span className="grid size-6 place-items-center rounded-full bg-amber-600 text-white" aria-hidden="true">
              <ArrowDownIcon className="size-4" weight="bold" />
            </span>
            Explore the workspace
          </a>
        </div>
      </section>

      <section
        className="min-h-96 border-zinc-200 border-b pt-[58px] pb-[54px]"
        id="workspace"
        aria-labelledby="workspace-title"
      >
        <SectionHeading
          description="Tender → contract → payment"
          id="workspace-title"
          index="01"
          title="The workspace"
        />

        <div className="mt-[42px] grid grid-cols-3 divide-x divide-zinc-200">
          {workspaceGroups.map((group) => (
            <div className="min-w-0 px-6 first:pl-0 last:pr-0" key={group.title}>
              <h3 className="m-0 flex gap-3 font-[550] text-base text-zinc-900 leading-[1.4]">
                <span className="font-mono text-zinc-500">{group.index}</span>
                {group.title}
              </h3>
              <ul className="mt-7 grid list-none gap-4 p-0">
                {group.items.map((item) => (
                  <li
                    className={`flex min-w-0 items-center justify-between whitespace-nowrap font-medium text-lg leading-[1.4] ${item === "Your workflow" ? "font-normal text-zinc-500" : "text-zinc-900"}`}
                    key={item}
                  >
                    {item}
                    {item === "Your workflow" && (
                      <ArrowUpRightIcon className="mr-4 size-4" weight="bold" aria-hidden="true" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
