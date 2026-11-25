import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatoMoneda } from "../../utils/format";
import { ChartEmptyState } from "./ChartEmptyState";

export function MonthlyOverviewChart({
  ingresos,
  gastos,
}: {
  ingresos: number;
  gastos: number;
}) {
  const hayDatos = ingresos > 0 || gastos > 0;
  const data = [{ nombre: "Este mes", ingresos, gastos }];

  return (
    <section className="rounded-2xl border border-secondary/40 bg-surface p-4" aria-label="Ingresos y gastos del mes">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-primary-dark">Ingresos vs. gastos</h2>
        <p className="text-xs text-neutral">Comparación del mes actual</p>
      </div>
      {!hayDatos ? (
        <ChartEmptyState
          titulo="Aún no hay movimientos del mes"
          descripcion="Registra un ingreso o un gasto para ver la comparación."
        />
      ) : (
        <div className="h-56 w-full sm:h-64" role="img" aria-label={`Ingresos ${formatoMoneda(ingresos)} y gastos ${formatoMoneda(gastos)}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0b99b" opacity={0.45} />
              <XAxis dataKey="nombre" tick={{ fill: "#7d7d6f", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#7d7d6f", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(valor) => `$${Math.round(valor / 1000)}k`} />
              <Tooltip formatter={(valor) => formatoMoneda(Number(valor))} contentStyle={{ borderRadius: 12, borderColor: "#e0b99b" }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#5f4b32" }} />
              <Bar name="Ingresos" dataKey="ingresos" fill="#6a8d73" radius={[6, 6, 0, 0]} />
              <Bar name="Gastos" dataKey="gastos" fill="#9c4a2e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral">
        <span><strong className="text-green">Ingresos:</strong> {formatoMoneda(ingresos)}</span>
        <span><strong className="text-danger">Gastos:</strong> {formatoMoneda(gastos)}</span>
      </div>
    </section>
  );
}
