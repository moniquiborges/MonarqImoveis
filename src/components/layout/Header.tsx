"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X, Heart } from "lucide-react";
import { primaryNav } from "./nav-data";
import { useFavorites } from "@/contexts/FavoritesContext";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { totalFavorites, setIsDrawerOpen } = useFavorites();

  return (
    <header className="sticky top-0 z-40 border-b border-graphite/8 bg-offwhite/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-[1480px] items-center justify-between px-5 md:px-8 lg:px-12">
        {/* Logo MONARQ */}
        <Link
          href="/"
          className="focus-ring shrink-0 flex items-center pr-2 md:pr-4"
          aria-label="MONARQ Imóveis & Investimentos - Página Inicial"
        >
          <Image
            src="/brand/monarq-logo-horizontal.png"
            alt="MONARQ Imóveis & Investimentos"
            width={180}
            height={46}
            priority
            className="h-8 md:h-9 xl:h-10 w-auto object-contain"
          />
        </Link>

        {/* Navegação Desktop Distribuída */}
        <nav className="hidden items-center gap-4 xl:gap-6 2xl:gap-7 lg:flex">
          {primaryNav.map((item) => (
            <div
              key={item.href}
              className="relative py-2"
              onMouseEnter={() => item.children && setOpenDropdown(item.label)}
              onMouseLeave={() => item.children && setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className="focus-ring flex items-center gap-1 text-[11.5px] xl:text-[12.5px] font-semibold uppercase tracking-[0.05em] text-graphite/75 transition-colors hover:text-mineral whitespace-nowrap py-1"
              >
                <span>{item.label}</span>
                {item.children ? (
                  <ChevronDown className="h-3 w-3 opacity-60 transition-transform duration-200 group-hover:rotate-180" />
                ) : null}
              </Link>

              {item.children ? (
                <div
                  className={cn(
                    "absolute left-0 top-full min-w-[210px] rounded-xs border border-areia/60 bg-white py-2 shadow-[0_16px_36px_-12px_rgba(21,58,70,0.18)] transition-all duration-200 z-50",
                    openDropdown === item.label
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0"
                  )}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="focus-ring block px-4 py-2 text-[12.5px] text-graphite/80 hover:bg-offwhite hover:text-mineral transition-colors"
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
        <div className="flex items-center gap-2.5 md:gap-3.5 shrink-0 pl-2">
          {/* Botão de Favoritos no Header */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label={`Ver ${totalFavorites} imóveis salvos`}
            className="focus-ring relative flex h-9.5 w-9.5 items-center justify-center rounded-full border border-areia/60 bg-white text-graphite/75 shadow-2xs hover:border-mineral/40 hover:text-terracota transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Meus Imóveis Salvos"
          >
            <Heart
              className={`h-4.5 w-4.5 ${
                totalFavorites > 0 ? "fill-terracota text-terracota" : ""
              }`}
            />
            {totalFavorites > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-terracota text-[9px] font-bold text-white shadow-xs animate-fade-in">
                {totalFavorites}
              </span>
            )}
          </button>

          {/* CTA Especialista */}
          <div className="hidden lg:block">
            <Link
              href="/contato"
              className="focus-ring inline-flex h-9.5 items-center justify-center rounded-xs bg-mineral px-4 text-[11.5px] xl:text-[12px] font-semibold uppercase tracking-[0.08em] text-offwhite hover:bg-mineral-light transition-colors whitespace-nowrap shadow-2xs"
            >
              Falar com Especialista
            </Link>
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

      {/* Menu Mobile Retrátil */}
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
                className="focus-ring block py-2 text-[14px] font-semibold uppercase tracking-wider text-graphite"
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
                      className="focus-ring py-1.5 text-[13px] text-graphite/70"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <Link
            href="/contato"
            onClick={() => setMobileOpen(false)}
            className="focus-ring mt-4 flex h-11 w-full items-center justify-center rounded-xs bg-mineral text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors"
          >
            Falar com Especialista
          </Link>
        </nav>
      </div>
    </header>
  );
}
