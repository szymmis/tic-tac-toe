import clsx from "clsx";

export default function Heading({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h1
      className={clsx(
        "mb-2 font-serif text-3xl md:text-4xl font-bold",
        className,
      )}
    >
      {title}
    </h1>
  );
}
