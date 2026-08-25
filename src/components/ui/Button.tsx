import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline-light";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-terracota text-offwhite hover:bg-terracota-light",
  secondary: "bg-mineral text-offwhite hover:bg-mineral-light",
  ghost: "bg-transparent text-graphite hover:bg-graphite/5",
  "outline-light":
    "border border-offwhite/40 text-offwhite hover:bg-offwhite/10 backdrop-blur-sm",
};

const baseClasses =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-[13px] font-medium uppercase tracking-[0.12em] transition-colors duration-300";

interface ButtonProps {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(baseClasses, variantClasses[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps & { href: string } & React.ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={cn(baseClasses, variantClasses[variant], className)} {...rest}>
      {children}
    </Link>
  );
}
