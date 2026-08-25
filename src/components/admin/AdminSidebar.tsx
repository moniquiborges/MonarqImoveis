"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "@/app/admin/nav-data";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-offwhite/10 bg-graphite text-offwhite lg:flex">
      <div className="flex items-center gap-3 border-b border-offwhite/10 px-6 py-6">
        <Image
          src="/brand/monarq-logo-vertical.jpg"
          alt="MONARQ"
          width={40}
          height={30}
          className="h-8 w-auto rounded-sm"
        />
        <span className="text-[12px] font-medium uppercase tracking-[0.15em] text-areia">Admin</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {adminNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring flex items-center gap-3 rounded-sm px-3 py-2.5 text-[13px] font-medium transition-colors",
                active ? "bg-offwhite/10 text-offwhite" : "text-offwhite/60 hover:bg-offwhite/5 hover:text-offwhite",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
