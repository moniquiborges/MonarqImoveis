export function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col gap-2 rounded-sm border border-graphite/10 bg-white p-6">
      <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-graphite/50">{label}</span>
      <span className="font-display text-3xl text-mineral">{value}</span>
    </div>
  );
}
