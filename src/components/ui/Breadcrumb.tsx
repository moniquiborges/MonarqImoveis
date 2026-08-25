import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Navegação em trilha" className="py-4 text-[13px] text-graphite/60">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-graphite/40 shrink-0" />}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-mineral focus-ring rounded-xs"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-graphite line-clamp-1" : ""}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
