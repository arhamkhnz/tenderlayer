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

const sectionHeadingClass =
  "grid grid-cols-[23px_minmax(0,1fr)_auto] items-baseline text-zinc-500 min-[1100px]:grid-cols-[46px_minmax(0,1fr)_auto] max-[700px]:grid-cols-[30px_minmax(0,1fr)] max-[700px]:gap-y-[5px]";

const sectionTextClass =
  "m-0 text-[8px] leading-[1.4] min-[1100px]:text-base max-[700px]:text-xs";

function StatusIcon() {
  return (
    <svg
      className="h-[7px] w-2.5 fill-zinc-400 min-[1100px]:h-3.5 min-[1100px]:w-5"
      viewBox="0 0 20 14"
      aria-hidden="true"
    >
      <path d="M5.1 13h10.1a4 4 0 0 0 .1-8 5.6 5.6 0 0 0-10.7 1.6A3.2 3.2 0 0 0 5.1 13Z" />
    </svg>
  );
}

function ProductGlyph() {
  const lineClass =
    "block h-0.5 w-[15px] rounded-sm bg-zinc-500 last:w-[17px] last:bg-amber-600 min-[1100px]:h-[3px] min-[1100px]:w-[25px] min-[1100px]:last:w-7";

  return (
    <span
      className="relative top-0.5 mx-0.5 inline-flex h-[30px] w-[35px] flex-col justify-center gap-[3px] rounded-md bg-zinc-700 px-2 align-baseline ring-1 ring-white/5 ring-inset min-[1100px]:top-1 min-[1100px]:mx-1 min-[1100px]:h-[50px] min-[1100px]:w-[58px] min-[1100px]:gap-[5px] min-[1100px]:rounded-[10px] min-[1100px]:px-[13px] max-[700px]:top-[3px] max-[700px]:h-[38px] max-[700px]:w-[43px]"
      aria-hidden="true"
    >
      <i className={lineClass} />
      <i className={lineClass} />
      <i className={lineClass} />
    </span>
  );
}

function PageContent() {
  return (
    <>
      <section
        className="min-h-[375px] border-b border-zinc-200 pt-16 pb-7 min-[1100px]:min-h-[750px] min-[1100px]:pt-32 min-[1100px]:pb-14 max-[700px]:min-h-0 max-[700px]:px-[22px] max-[700px]:pt-7 max-[700px]:pb-[42px]"
        id="top"
        aria-labelledby="hero-title"
      >
        <h1
          className="mt-8 mb-0 text-[clamp(28px,3.9vw,34px)] leading-[1.05] font-[650] tracking-[-0.052em] min-[1100px]:mt-16 min-[1100px]:text-[clamp(48px,3.4vw,60px)] max-[700px]:mt-11 max-[700px]:text-[clamp(36px,10.5vw,54px)]"
          id="hero-title"
        >
          Every tender.<br />
          Precisely <ProductGlyph /> connected.<br />
          <span className="font-serif text-[1.08em] font-normal tracking-[-0.035em]">
            Nothing scattered.
          </span>
        </h1>

        <p className="mt-[21px] mb-0 max-w-[319px] text-[11px] leading-[1.55] tracking-[-0.018em] text-zinc-600 min-[1100px]:mt-[42px] min-[1100px]:max-w-[638px] min-[1100px]:text-[22px] max-[700px]:max-w-xl max-[700px]:text-base">
          <strong className="font-medium text-zinc-900">
            Bring every tender operation into one clear workspace.
          </strong>{" "}
          From bid preparation to active contracts, people, payroll, invoices,
          and records, TenderLayer keeps the work connected and on your device.
        </p>

        <div className="mt-[30px] flex items-center gap-[19px] min-[1100px]:mt-[60px] min-[1100px]:gap-[38px] max-[700px]:mt-[34px]">
          <a
            className="inline-flex min-h-[29px] items-center justify-center rounded-[3px] border border-zinc-800 bg-zinc-800 px-3 text-[9px] font-medium text-white shadow-sm transition-colors duration-150 hover:bg-transparent hover:text-zinc-900 motion-reduce:transition-none min-[1100px]:min-h-[58px] min-[1100px]:rounded-md min-[1100px]:px-6 min-[1100px]:text-lg max-[700px]:min-h-11 max-[700px]:text-sm"
            href={repositoryUrl}
          >
            View on GitHub
          </a>
          <a
            className="inline-flex min-h-[29px] items-center justify-center gap-1.5 border-b border-transparent text-[9px] font-medium text-amber-700 transition-colors duration-150 hover:border-current motion-reduce:transition-none min-[1100px]:min-h-[58px] min-[1100px]:gap-3 min-[1100px]:text-lg max-[700px]:min-h-11 max-[700px]:text-sm"
            href="#workspace"
          >
            <span className="grid size-3 place-items-center rounded-full bg-amber-600 text-[7px] text-white min-[1100px]:size-6 min-[1100px]:text-sm" aria-hidden="true">
              ↓
            </span>
            Explore the workspace
          </a>
        </div>
      </section>

      <section
        className="min-h-[192px] border-b border-zinc-200 pt-[29px] pb-[27px] min-[1100px]:min-h-96 min-[1100px]:pt-[58px] min-[1100px]:pb-[54px] max-[700px]:min-h-0 max-[700px]:px-[22px] max-[700px]:pt-[38px] max-[700px]:pb-[42px]"
        id="workspace"
        aria-labelledby="workspace-title"
      >
        <header className={sectionHeadingClass}>
          <p className={`${sectionTextClass} font-mono`}>01</p>
          <p className={sectionTextClass} id="workspace-title">The workspace</p>
          <p className={`${sectionTextClass} pr-2 max-[700px]:col-start-2 max-[700px]:pr-0`}>
            Tender → contract → payment
          </p>
        </header>

        <div className="mt-[21px] grid grid-cols-3 divide-x divide-zinc-200 min-[1100px]:mt-[42px] max-[700px]:mt-[30px] max-[700px]:grid-cols-1 max-[700px]:gap-[26px] max-[700px]:divide-x-0">
          {workspaceGroups.map((group) => (
            <div className="min-w-0 px-3 first:pl-0 last:pr-0 min-[1100px]:px-6 max-[700px]:px-0" key={group.title}>
              <p className={`${sectionTextClass} flex gap-1.5 font-[550] text-zinc-900 min-[1100px]:gap-3`}>
                <span className="font-mono text-zinc-500">{group.index}</span>
                {group.title}
              </p>
              <ul className="mt-3.5 grid list-none gap-2 p-0 min-[1100px]:mt-7 min-[1100px]:gap-4 max-[700px]:grid-cols-2 max-[700px]:gap-x-[18px] max-[700px]:gap-y-3">
                {group.items.map((item) => (
                  <li
                    className={`flex min-w-0 items-center justify-between whitespace-nowrap text-[9px] leading-[1.4] font-medium min-[1100px]:text-lg max-[700px]:text-sm ${item === "Your workflow" ? "font-normal text-zinc-500" : "text-zinc-900"}`}
                    key={item}
                  >
                    {item}
                    {item === "Your workflow" && <span className="mr-2 text-[7px] min-[1100px]:mr-4 min-[1100px]:text-sm" aria-hidden="true">↗</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        className="min-h-[245px] border-b border-zinc-200 pt-[30px] pb-[35px] min-[1100px]:min-h-[490px] min-[1100px]:pt-[60px] min-[1100px]:pb-[70px] max-[700px]:min-h-0 max-[700px]:px-[22px] max-[700px]:pt-[38px] max-[700px]:pb-[42px]"
        id="story"
        aria-labelledby="story-title"
      >
        <header className={sectionHeadingClass}>
          <p className={`${sectionTextClass} font-mono`}>02</p>
          <p className={sectionTextClass} id="story-title">Why it exists</p>
          <p className={`${sectionTextClass} pr-2 max-[700px]:col-start-2 max-[700px]:pr-0`}>
            Built from real operations
          </p>
        </header>

        <h2 className="mt-[23px] mb-0 max-w-[319px] font-serif text-2xl leading-[1.02] font-normal tracking-[-0.035em] min-[1100px]:mt-[46px] min-[1100px]:max-w-[638px] min-[1100px]:text-5xl max-[700px]:mt-[30px] max-[700px]:max-w-xl max-[700px]:text-[34px]">
          Built for the work<br />between winning and delivering.
        </h2>

        <div className="mt-5 max-w-[319px] min-[1100px]:mt-10 min-[1100px]:max-w-[638px] max-[700px]:max-w-xl">
          <p className="m-0 text-[11px] leading-[1.55] tracking-[-0.018em] text-zinc-600 min-[1100px]:text-[22px] max-[700px]:text-base">
            TenderLayer started inside a family-run outsourcing agency in India,
            where more than <strong className="font-[550] text-zinc-900">500 employees</strong> and over <strong className="font-[550] text-zinc-900">70 active contracts</strong> create a constant flow of people, paperwork, and payments.
          </p>
          <p className="mt-3.5 mb-0 text-[11px] leading-[1.55] tracking-[-0.018em] text-zinc-600 min-[1100px]:mt-7 min-[1100px]:text-[22px] max-[700px]:text-base">
            It is an <strong className="font-[550] text-zinc-900">open-source, local-first desktop app</strong> designed to keep that work together—from the first tender to the final payment.
          </p>
        </div>
      </section>
    </>
  );
}

export default function Home() {
  return (
    <div className="grid">
      <div
        className="pointer-events-none sticky top-0 z-20 col-start-1 row-start-1 mt-[60px] h-8 self-start bg-zinc-50 min-[1100px]:mt-[120px] min-[1100px]:h-16 max-[700px]:hidden"
        aria-hidden="true"
      />
      <div className="sticky top-2.5 z-40 col-start-1 row-start-1 mt-16 flex min-h-3 self-start items-center justify-between gap-3 text-[8px] leading-[1.4] text-zinc-500 min-[1100px]:top-5 min-[1100px]:mt-32 min-[1100px]:min-h-6 min-[1100px]:gap-6 min-[1100px]:text-base max-[700px]:static max-[700px]:mt-7 max-[700px]:px-[22px] max-[700px]:text-[10px]">
        <p className="m-0 flex items-center gap-[5px] whitespace-nowrap min-[1100px]:gap-2.5">
          <StatusIcon /> Local-first <span className="text-zinc-300">·</span> Private by design
        </p>
        <p className="m-0 flex items-center gap-[5px] whitespace-nowrap min-[1100px]:gap-2.5 max-[700px]:hidden">
          Open source <span className="text-zinc-300">·</span> In development
        </p>
      </div>
      <div className="col-start-1 row-start-1 min-w-0">
        <PageContent />
      </div>
    </div>
  );
}
