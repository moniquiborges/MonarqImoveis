import { cn } from "@/lib/utils";
import { propertyBadgeLabels } from "@/lib/labels";
import type { PropertyBadge } from "@/types";

const emphasisBadges: PropertyBadge[] = ["exclusivo", "frente-mar", "alto-padrao"];

export function Badge({ badge }: { badge: PropertyBadge }) {
  const isEmphasis = emphasisBadges.includes(badge);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] backdrop-blur-sm",
        isEmphasis ? "bg-terracota text-offwhite" : "bg-offwhite/90 text-graphite",
      )}
    >
      {propertyBadgeLabels[badge]}
    </span>
  );
}
