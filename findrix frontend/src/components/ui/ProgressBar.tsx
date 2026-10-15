export function ProgressBar({ valor }: { valor: number }) {
  const pct = Math.min(100, Math.max(0, valor * 100));

  // El color comunica qué tan cerca está la meta: naranja = arrancando,
  // dorado = en camino, verde = ya casi/lograda. Así el verde queda asociado
  // en toda la app con "vas bien", no solo con ingresos.
  const barColor = pct >= 90 ? "bg-green" : pct >= 50 ? "bg-gold" : "bg-primary";

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/30">
      <div
        className={`h-full rounded-full ${barColor} transition-colors duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}