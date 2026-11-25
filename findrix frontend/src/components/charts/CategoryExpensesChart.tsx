import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Categoria, Gasto } from "../../types";
import { formatoMoneda } from "../../utils/format";
import { ChartEmptyState } from "./ChartEmptyState";

const colores = ["#b85c38", "#c19a6b", "#6a8d73", "#9c4a2e", "#5f4b32", "#e0b99b"];

export function CategoryExpensesChart({
  gastos,
  categorias,
}: {
  gastos: Gasto[];
  categorias: Categoria[];
}) {
  const totales = new Map<string, number>();
  for (const gasto of gastos) {
    totales.set(gasto.categoriaId, (totales.get(gasto.categoriaId) ?? 0) + gasto.monto);
  }

  const ordenados = Array.from(totales.entries())
    .map(([categoriaId, total]) => ({
      nombre: categorias.find((categoria) => categoria.id === categoriaId)?.nombre ?? "Otro",
      total,
    }))
    .sort((a, b) => b.total - a.total);
  const visibles = ordenados.slice(0, 6);
  const totalOtros = ordenados.slice(6).reduce((total, item) => total + item.total, 0);
  const data = totalOtros > 0 ? [...visibles, { nombre: "Otros", total: totalOtros }] : visibles;

  return (
    <section className="rounded-2xl border border-secondary/40 bg-surface p-4" aria-label="Gastos por categoría">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-primary-dark">Gastos por categoría</h2>
        <p className="text-xs text-neutral">Dónde se concentra tu gasto este mes</p>
      </div>
      {data.length === 0 ? (
        <ChartEmptyState
          titulo="Todavía no hay categorías con gastos"
          descripcion="Cuando registres gastos aparecerá aquí su distribución."
        />
      ) : (
        <div className="h-56 w-full sm:h-64" role="img" aria-label="Barras horizontales de gastos agrupados por categoría">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0b99b" opacity={0.35} horizontal={false} />
              <XAxis type="number" tick={{ fill: "#7d7d6f", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(valor) => `$${Math.round(valor / 1000)}k`} />
              <YAxis type="category" dataKey="nombre" width={82} tick={{ fill: "#5f4b32", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(valor) => formatoMoneda(Number(valor))} contentStyle={{ borderRadius: 12, borderColor: "#e0b99b" }} />
              <Bar name="Gastos" dataKey="total" fill="#b85c38" radius={[0, 6, 6, 0]}>{data.map((item, indice) => <Cell key={item.nombre} fill={colores[indice % colores.length]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {data.length > 0 && <p className="mt-3 text-xs text-neutral">Cada barra muestra el total gastado; pasa el cursor para ver el valor exacto.</p>}
    </section>
  );
}
