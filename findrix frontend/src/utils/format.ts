
const soloFecha = (iso: string) => iso.slice(0, 10);

export function formatoMoneda(valor: number): string {
  return "$" + Math.round(valor).toLocaleString("es-CO");
}

export function formatoFechaCorta(iso: string): string {
  const d = new Date(soloFecha(iso) + "T00:00:00");
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

export function etiquetaVencimiento(iso: string): { texto: string; urgente: boolean } {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const venc = new Date(soloFecha(iso) + "T00:00:00");
  const dias = Math.round((venc.getTime() - hoy.getTime()) / 86400000);

  if (dias < 0) return { texto: "Vencido", urgente: true };
  if (dias === 0) return { texto: "Vence hoy", urgente: true };
  if (dias === 1) return { texto: "En 1 día", urgente: true };
  if (dias <= 3) return { texto: `En ${dias} días`, urgente: true };
  return { texto: `En ${dias} días`, urgente: false };
}

export function etiquetaGrupoFecha(iso: string): string {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fecha = new Date(soloFecha(iso) + "T00:00:00");
  const dias = Math.round((hoy.getTime() - fecha.getTime()) / 86400000);
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Ayer";
  return formatoFechaCorta(iso);
}