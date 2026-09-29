export default function WhyPage() {
  return (
    <section className="min-h-[calc(100vh-var(--site-content-start))] p-1 pt-16">
      <h1 className="font-normal text-5xl leading-none tracking-tight">Why TenderLayer</h1>
      <p className="mt-6 max-w-xl text-xl text-zinc-600 leading-normal">
        Built for the operational work between winning a tender and receiving the final payment.
      </p>

      <div className="mt-12 max-w-[638px]">
        <p className="m-0 text-[22px] text-zinc-600 leading-[1.55] tracking-[-0.018em]">
          TenderLayer started inside a family-run outsourcing agency in India, where more than{" "}
          <strong className="font-[550] text-zinc-900">500 employees</strong> and over{" "}
          <strong className="font-[550] text-zinc-900">70 active contracts</strong> create a constant flow of people,
          paperwork, and payments.
        </p>
        <p className="mt-7 mb-0 text-[22px] text-zinc-600 leading-[1.55] tracking-[-0.018em]">
          It is an <strong className="font-[550] text-zinc-900">open-source, local-first desktop app</strong> designed
          to keep that work together—from the first tender to the final payment.
        </p>
      </div>
    </section>
  );
}
