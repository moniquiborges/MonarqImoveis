import Image from "next/image";

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-graphite px-6 py-16">
      <Image
        src="/brand/monarq-logo-vertical.jpg"
        alt="MONARQ Imóveis & Investimentos"
        width={140}
        height={105}
        className="mb-10 h-auto w-28 rounded-sm"
      />
      <div className="w-full max-w-sm rounded-sm bg-offwhite p-8 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.5)]">
        {children}
      </div>
    </div>
  );
}
