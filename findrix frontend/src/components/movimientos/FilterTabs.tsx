export type FiltroMovimiento = "todos" | "gasto" | "ingreso";

const opciones: { id: FiltroMovimiento; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "gasto", label: "Gastos" },
  { id: "ingreso", label: "Ingresos" },
];

export function FilterTabs({
  valor,
  onChange,
}: {
  valor: FiltroMovimiento;
  onChange: (v: FiltroMovimiento) => void;
}) {
  return (
    <div className="flex gap-2">
      {opciones.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            valor === o.id ? "bg-primary text-surface" : "bg-base-soft text-neutral"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
