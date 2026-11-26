import { useState } from "react";
import { FeedbackMessage } from "../ui/FeedbackMessage";
import { useAppData } from "../../context/AppDataContext";
import { Icon, iconosCategoria } from "../ui/Icon";
import type { Categoria } from "../../types";

export function NuevaCategoriaForm({ onListo, categoria }: { onListo: () => void; categoria?: Categoria }) {
  const { agregarCategoria, actualizarCategoria } = useAppData();
  const [nombre, setNombre] = useState(categoria?.nombre ?? "");
  const [tipo, setTipo] = useState<"gasto" | "ingreso">(categoria?.tipo ?? "gasto");
  const [icono, setIcono] = useState(categoria?.icono ?? iconosCategoria[0]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const editando = Boolean(categoria);

  const guardar = async () => {
    setGuardando(true); setError(null);
    try {
      if (categoria) await actualizarCategoria(categoria.id, { nombre: nombre.trim(), icono });
      else await agregarCategoria({ nombre: nombre.trim(), tipo, icono });
      setExito(editando ? "La categoría se actualizó correctamente." : "La categoría se guardó correctamente.");
      window.setTimeout(onListo, 450);
    } catch (err) { setError(err instanceof Error ? err.message : "No se pudo guardar la categoría."); }
    finally { setGuardando(false); }
  };

  return <div className="flex flex-col gap-5">
    <p className="font-display text-lg text-primary-dark">{editando ? "Editar categoría" : "Nueva categoría"}</p>
    <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre de la categoría" autoFocus className="rounded-xl border border-secondary/50 bg-base-soft px-4 py-2.5 text-sm text-primary-dark outline-none placeholder:text-neutral focus:border-primary" />
    {!editando && <div><p className="mb-2 text-sm font-semibold text-primary-dark">¿Dónde la usarás?</p><div className="flex gap-2 rounded-xl bg-base-soft p-1"><button type="button" onClick={() => setTipo("gasto")} className={`flex-1 rounded-lg py-1.5 text-sm font-medium ${tipo === "gasto" ? "bg-surface text-primary-dark shadow-sm" : "text-neutral"}`}>Gasto</button><button type="button" onClick={() => setTipo("ingreso")} className={`flex-1 rounded-lg py-1.5 text-sm font-medium ${tipo === "ingreso" ? "bg-surface text-primary-dark shadow-sm" : "text-neutral"}`}>Ingreso</button></div></div>}
    <div><p className="mb-2 text-sm font-semibold text-primary-dark">Ícono</p><div className="grid grid-cols-6 gap-2">{iconosCategoria.map((nombreIcono) => <button type="button" key={nombreIcono} onClick={() => setIcono(nombreIcono)} aria-label={nombreIcono} className={`flex h-10 w-10 items-center justify-center rounded-xl border ${icono === nombreIcono ? "border-primary bg-primary/10 text-primary" : "border-secondary/50 text-neutral"}`}><Icon nombre={nombreIcono} size={18} /></button>)}</div></div>
    {error && <FeedbackMessage tipo="error">{error}</FeedbackMessage>}{exito && <FeedbackMessage tipo="exito">{exito}</FeedbackMessage>}
    <button type="button" onClick={guardar} disabled={!nombre.trim() || guardando} className="rounded-xl bg-primary py-3 text-sm font-semibold text-surface disabled:opacity-40">{guardando ? "Guardando…" : editando ? "Guardar cambios" : "Guardar categoría"}</button>
  </div>;
}
