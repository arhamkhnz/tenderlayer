export default function ProductOverviewSection() {
  return (
    <section className="flex flex-col gap-4" aria-labelledby="workspace-title">
      <h2 className="font-normal text-foreground text-lg leading-7" id="workspace-title">
        What we’re building
      </h2>
      <div className="flex flex-col gap-2 text-pretty font-normal text-base text-muted leading-6">
        <p>
          A workspace for managing contracts after a tender is awarded. It will bring contract details, dates,
          deadlines, employee records, and contract assignments together.
        </p>
        <p>
          The first-phase plan also includes invoice generation, payment tracking, payroll, payslips, tax and GST
          details, notes, and contract history.
        </p>
      </div>
    </section>
  );
}
