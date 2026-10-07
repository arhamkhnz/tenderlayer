export default function RoadmapSection() {
  return (
    <section
      className="flex flex-col gap-4 font-normal text-base leading-6"
      aria-labelledby="roadmap-title"
      id="roadmap"
    >
      <h2 className="font-normal text-foreground text-lg leading-7" id="roadmap-title">
        Where we’re headed
      </h2>
      <div className="flex flex-col gap-2 text-pretty text-muted">
        <p>
          TenderLayer is in early development. The first phase focuses on{" "}
          <span className="text-foreground">awarded tenders and active contracts</span>.
        </p>
        <p>
          The second phase will cover <span className="text-foreground">upcoming bids</span>: checking requirements and
          eligibility, deciding whether to apply, preparing bids, and tracking submissions, deadlines, outcomes, and bid
          history.
        </p>
        <p>
          A built-in AI agent is a core part of the plan. It will automate everyday work, from generating invoices and
          finding records to preparing and submitting tender applications.
        </p>
        <p>
          Longer-term plans include collaboration, Cloud / Local sync, backups, data import and export, reminders,
          reporting, and procurement portal integrations.
        </p>
      </div>
    </section>
  );
}
