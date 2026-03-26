type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl space-y-4">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
      <p className="text-base text-muted sm:text-lg">{description}</p>
    </div>
  );
}
