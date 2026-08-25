"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X, Heart } from "lucide-react";
import { primaryNav } from "./nav-data";
import { ButtonLink } from "@/components/ui/Button";
import { useFavorites } from "@/contexts/FavoritesContext";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { totalFavorites, setIsDrawerOpen } = useFavorites();

  return (
    <header className="sticky top-0 z-40 border-b border-graphite/8 bg-offwhite/95 backdrop-blur-sm">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-6 md:px-10 lg:px-16">
        <Link href="/" className="focus-ring shrink-0" aria-label="MONARQ Imóveis & Investimentos">
          <Image
            src="/brand/monarq-logo-horizontal.png"
            alt="MONARQ Imóveis & Investimentos"
            width={175}
            height={45}
            priority
            className="h-9 w-auto md:h-10"
          />
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden items-center gap-7 xl:gap-8 lg:flex">
          {primaryNav.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(item.label)}
              onMouseLeave={() => item.children && setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className="focus-ring flex items-center gap-1 py-2 text-[13px] font-medium uppercase tracking-[0.06em] text-graphite/80 transition-colors hover:text-mineral"
              >
                {item.label}
                {item.children ? <ChevronDown className="h-3.5 w-3.5" /> : null}
              </Link>

              {item.children ? (
                <div
                  className={cn(
                    "absolute left-0 top-full min-w-[220px] rounded-sm border border-graphite/8 bg-white py-2 shadow-[0_16px_40px_-16px_rgba(21,58,70,0.25)] transition-all duration-200 z-50",
                    openDropdown === item.label
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0"
                  )}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="focus-ring block px-4 py-2 text-[13px] text-graphite/80 hover:bg-offwhite hover:text-mineral"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        {/* Lado Direito: Favoritos & CTA */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Botão de Favoritos no Header */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label={`Ver ${totalFavorites} imóveis favoritados`}
            className="focus-ring relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-graphite/80 shadow-2xs hover:text-terracota transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Meus Imóveis Salvos"
          >
            <Heart
              className={`h-5 w-5 ${
                totalFavorites > 0 ? "fill-terracota text-terracota" : ""
              }`}
            />
            {totalFavorites > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-terracota text-[10px] font-bold text-white shadow-sm animate-fade-in">
                {totalFavorites}
              </span>
            )}
          </button>

          <div className="hidden lg:block">
            <ButtonLink href="/contato" variant="primary">
              Falar com Especialista
            </ButtonLink>
          </div>

          {/* Botão Menu Mobile */}
          <button
            type="button"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            className="focus-ring flex h-10 w-10 items-center justify-center text-graphite lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <div
        className={cn(
          "overflow-y-auto border-t border-graphite/8 bg-offwhite transition-[max-height] duration-300 ease-in-out lg:hidden",
          mobileOpen ? "max-h-[calc(100vh-5rem)]" : "max-h-0 border-t-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-6 py-4">
          {primaryNav.map((item) => (
            <div key={item.href} className="border-b border-graphite/5 py-1">
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="focus-ring block py-2.5 text-[15px] font-medium text-graphite"
              >
                {item.label}
              </Link>
              {item.children ? (
                <div className="flex flex-col gap-0.5 pb-2 pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="focus-ring py-1.5 text-[13px] text-graphite/65"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <ButtonLink
            href="/contato"
            variant="primary"
            className="mt-4 w-full"
            onClick={() => setMobileOpen(false)}
          >
            Falar com Especialista
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
