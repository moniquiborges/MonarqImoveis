import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "text-[12px] font-medium uppercase tracking-[0.2em]",
            light ? "text-areia" : "text-terracota",
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "font-display text-balance text-3xl font-normal leading-[1.15] md:text-4xl lg:text-[2.75rem]",
          light ? "text-offwhite" : "text-graphite",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("text-[15px] leading-relaxed", light ? "text-offwhite/70" : "text-graphite/65")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
