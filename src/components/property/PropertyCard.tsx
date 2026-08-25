import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "./FavoriteButton";
import { formatBRL } from "@/lib/utils";
import type { PropertyBadge, PropertyImage } from "@/types";

export interface PropertyCardSpec {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export interface PropertyCardProps {
  href: string;
  image: PropertyImage;
  badges: PropertyBadge[];
  title: string;
  location: string;
  price?: number | null;
  specs: PropertyCardSpec[];
  code?: string;
}

export function PropertyCard({
  href,
  image,
  badges,
  title,
  location,
  price,
  specs,
  code,
}: PropertyCardProps) {
  // Extrai o slug a partir do href (ex: /empreendimentos/porto-belo/essenza-porto-belo -> essenza-porto-belo)
  const slug = href.split("/").pop() || title;

  const favoriteItem = {
    slug,
    href,
    title,
    location,
    price,
    image,
    code,
    specsSummary: specs.map((s) => s.label).join(" · "),
  };

  return (
    <article className="group flex flex-col relative">
      <div className="relative block overflow-hidden rounded-sm">
        <Link href={href} className="focus-ring relative block overflow-hidden">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-areia/40">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </div>

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
            {badges.slice(0, 2).map((badge) => (
              <Badge key={badge} badge={badge} />
            ))}
          </div>
        </Link>

        {/* Botão Favoritar */}
        <FavoriteButton item={favoriteItem} />
      </div>

      <div className="flex flex-col gap-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[12px] uppercase tracking-[0.1em] text-graphite/70">{location}</p>
            <Link href={href} className="focus-ring">
              <h3 className="font-display text-lg leading-snug text-graphite group-hover:text-mineral transition-colors">
                {title}
              </h3>
            </Link>
          </div>
          {code ? <span className="shrink-0 font-mono text-[11px] text-graphite/60">{code}</span> : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-graphite/70">
          {specs.map((spec, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <spec.icon className="h-4 w-4 text-mineral" />
              {spec.label}
            </span>
          ))}
        </div>

        <p className="pt-1 text-[15px] font-medium text-mineral">
          {price ? formatBRL(price) : "Consulte valores"}
        </p>
      </div>
    </article>
  );
}
