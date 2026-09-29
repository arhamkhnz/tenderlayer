type SectionHeadingProps = {
  description: string;
  id: string;
  index: string;
  title: string;
};

export default function SectionHeading({ description, id, index, title }: SectionHeadingProps) {
  return (
    <header className="grid grid-cols-[46px_minmax(0,1fr)_auto] items-baseline text-base text-zinc-500 leading-[1.4]">
      <span className="font-mono" aria-hidden="true">
        {index}
      </span>
      <h2 className="m-0 font-normal text-base text-zinc-500 leading-[1.4]" id={id}>
        {title}
      </h2>
      <p className="m-0 pr-2">{description}</p>
    </header>
  );
}
