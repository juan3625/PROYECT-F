export function ChartEmptyState({
  titulo,
  descripcion,
}: {
  titulo: string;
  descripcion: string;
}) {
  return (
    <div className="flex min-h-52 items-center justify-center rounded-xl bg-base-soft px-5 text-center">
      <div>
        <p className="text-sm font-semibold text-primary-dark">{titulo}</p>
        <p className="mt-1 text-xs text-neutral">{descripcion}</p>
      </div>
    </div>
  );
}
