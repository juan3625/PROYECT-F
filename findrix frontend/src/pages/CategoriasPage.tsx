import { useState } from "react";
import { useAppData } from "../context/AppDataContext";
import { SubPageHeader } from "../components/ui/SubPageHeader";
import { Icon } from "../components/ui/Icon";
import { Sheet } from "../components/ui/Sheet";
import { NuevaCategoriaForm } from "../components/categorias/NuevaCategoriaForm";
import { EmptyState } from "../components/ui/EmptyState";

export function CategoriasPage() {
  const { categorias } = useAppData();
  const gasto = categorias.filter((c) => c.tipo === "gasto");
  const ingreso = categorias.filter((c) => c.tipo === "ingreso");
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="flex flex-col gap-5 pb-4">
      <SubPageHeader titulo="Categorías" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 sm:px-8 lg:px-10">
        {gasto.length > 0 ? (
          <Bloque titulo="Gastos" items={gasto} />
        ) : (
          <EmptyState titulo="No hay categorías de gastos" descripcion="Crea una para clasificar mejor tus gastos." accion={<button onClick={() => setAbierto(true)} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-surface">Crear categoría</button>} />
        )}
        {ingreso.length > 0 ? (
          <Bloque titulo="Ingresos" items={ingreso} />
        ) : (
          <EmptyState titulo="No hay categorías de ingresos" descripcion="Crea una para organizar el dinero que recibes." accion={<button onClick={() => setAbierto(true)} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-surface">Crear categoría</button>} />
        )}
        <button
          onClick={() => setAbierto(true)}
          className="rounded-xl border border-dashed border-primary/60 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
        >
          + Agregar categoría
        </button>
      </div>
      <Sheet abierto={abierto} onCerrar={() => setAbierto(false)}>
        <NuevaCategoriaForm onListo={() => setAbierto(false)} />
      </Sheet>
    </div>
  );
}

function Bloque({ titulo, items }: { titulo: string; items: { id: string; nombre: string; icono: string }[] }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral">{titulo}</p>
      <div className="divide-y divide-secondary/20 rounded-xl border border-secondary/30 bg-surface">
        {items.map((c) => (
          <div key={c.id} className="flex items-center gap-3 px-4 py-3 text-sm text-primary-dark">
            <Icon nombre={c.icono} size={16} className="text-neutral" />
            {c.nombre}
          </div>
        ))}
      </div>
    </div>
  );
}
