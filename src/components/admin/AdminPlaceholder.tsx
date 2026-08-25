export function AdminPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-graphite">{title}</h1>
        <p className="text-[14px] text-graphite/60">{description}</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-graphite/20 bg-white py-20 text-center">
        <p className="text-[14px] text-graphite/50">Nenhum registro encontrado ainda.</p>
        <p className="text-[13px] text-graphite/35">
          O CRUD completo desta seção será implementado nas próximas fases.
        </p>
      </div>
    </div>
  );
}
