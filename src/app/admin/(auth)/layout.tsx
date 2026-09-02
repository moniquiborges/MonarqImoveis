import Image from "next/image";

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-graphite px-6 py-16">
      <Image
        src="/brand/monarq-logo-white.png"
        alt="MONARQ Imóveis & Investimentos"
        width={160}
        height={94}
        className="mb-10 h-auto w-36"
      />
      <div className="w-full max-w-sm rounded-sm bg-offwhite p-8 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.5)]">
        {children}
      </div>
    </div>
  );
}
