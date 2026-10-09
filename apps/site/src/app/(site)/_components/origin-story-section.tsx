export default function OriginStorySection() {
  return (
    <section
      className="flex flex-col gap-4 font-normal text-base text-muted-foreground leading-6"
      aria-labelledby="why-title"
    >
      <h2 className="font-normal text-foreground text-lg leading-7" id="why-title">
        Why we’re building it
      </h2>
      <div className="flex flex-col gap-2 text-pretty">
        <p>
          TenderLayer grew out of my family business in India. As the business grew, managing contracts, employee
          records, invoices, and payroll across spreadsheets and folders became harder.
        </p>
        <p>
          We tried free and paid tools, and I built an early web version myself. These helped the business, but some
          problems remained. I started building TenderLayer from those experiences to better support our day-to-day work
          and keep sensitive business data local.
        </p>
      </div>
    </section>
  );
}
