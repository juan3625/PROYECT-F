import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import { SubPageHeader } from "../components/ui/SubPageHeader";
import { Icon } from "../components/ui/Icon";
import { Sheet } from "../components/ui/Sheet";
import { NuevaCategoriaForm } from "../components/categorias/NuevaCategoriaForm";
import { EmptyState } from "../components/ui/EmptyState";
import { FeedbackMessage } from "../components/ui/FeedbackMessage";
import type { Categoria } from "../types";

export function CategoriasPage() {
  const { categorias, eliminarCategoria } = useAppData();
  const gasto = categorias.filter((c) => c.tipo === "gasto");
  const ingreso = categorias.filter((c) => c.tipo === "ingreso");
  const [abierta, setAbierta] = useState(false);
  const [editando, setEditando] = useState<Categoria | undefined>();
  const [error, setError] = useState<string | null>(null);
  const abrirNueva = () => { setEditando(undefined); setAbierta(true); setError(null); };
  const abrirEdicion = (categoria: Categoria) => { setEditando(categoria); setAbierta(true); setError(null); };
  const borrar = async (categoria: Categoria) => {
    if (!window.confirm(`¿Eliminar “${categoria.nombre}”? Solo se puede eliminar si no tiene movimientos asociados.`)) return;
    setError(null);
    try { await eliminarCategoria(categoria.id); } catch (err) { setError(err instanceof Error ? err.message : "No se pudo eliminar la categoría."); }
  };
  return <div className="flex flex-col gap-5 pb-4"><SubPageHeader titulo="Categorías" /><div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 sm:px-8 lg:px-10">{error && <FeedbackMessage tipo="error">{error}</FeedbackMessage>}{gasto.length > 0 ? <Bloque titulo="Gastos" items={gasto} onEditar={abrirEdicion} onEliminar={borrar} /> : <EmptyState titulo="No hay categorías de gastos" descripcion="Crea una para clasificar mejor tus gastos." accion={<button onClick={abrirNueva} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-surface">Crear categoría</button>} />}{ingreso.length > 0 ? <Bloque titulo="Ingresos" items={ingreso} onEditar={abrirEdicion} onEliminar={borrar} /> : <EmptyState titulo="No hay categorías de ingresos" descripcion="Crea una para organizar el dinero que recibes." accion={<button onClick={abrirNueva} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-surface">Crear categoría</button>} />}<button onClick={abrirNueva} className="rounded-xl border border-dashed border-primary/60 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5">+ Agregar categoría</button></div><Sheet abierto={abierta} onCerrar={() => setAbierta(false)}><NuevaCategoriaForm categoria={editando} onListo={() => setAbierta(false)} /></Sheet></div>;
}

function Bloque({ titulo, items, onEditar, onEliminar }: { titulo: string; items: Categoria[]; onEditar: (categoria: Categoria) => void; onEliminar: (categoria: Categoria) => void }) {
  return <div><p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral">{titulo}</p><div className="divide-y divide-secondary/20 rounded-xl border border-secondary/30 bg-surface">{items.map((categoria) => <div key={categoria.id} className="flex items-center gap-3 px-4 py-3 text-sm text-primary-dark"><Icon nombre={categoria.icono} size={16} className="text-neutral" /><span className="min-w-0 flex-1 truncate">{categoria.nombre}</span><button type="button" onClick={() => onEditar(categoria)} className="rounded-lg p-2 text-neutral hover:bg-base-soft hover:text-primary" aria-label={`Editar ${categoria.nombre}`}><Pencil size={15} /></button><button type="button" onClick={() => onEliminar(categoria)} className="rounded-lg p-2 text-neutral hover:bg-danger/10 hover:text-danger" aria-label={`Eliminar ${categoria.nombre}`}><Trash2 size={15} /></button></div>)}</div></div>;
}
