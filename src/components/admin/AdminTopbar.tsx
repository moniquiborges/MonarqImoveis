import { LogOut } from "lucide-react";
import { signOut } from "@/app/admin/(dashboard)/actions";

export function AdminTopbar({ email }: { email: string | null }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-graphite/8 bg-offwhite px-6">
      <p className="text-[13px] text-graphite/60">{email}</p>
      <form action={signOut}>
        <button
          type="submit"
          className="focus-ring flex items-center gap-2 rounded-sm px-3 py-2 text-[13px] font-medium text-graphite/70 transition-colors hover:bg-graphite/5 hover:text-graphite"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </form>
    </header>
  );
}
