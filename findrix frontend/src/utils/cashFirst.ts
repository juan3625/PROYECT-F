export type CashEntryType = "ingreso" | "gasto";
export type CashEntrySource = "efectivo" | "propina" | "trabajo-extra" | "whatsapp" | "venta" | "otro";

export interface CashEntry {
  id: string;
  tipo: CashEntryType;
  fuente: CashEntrySource;
  descripcion: string;
  monto: number;
  fecha: string;
}

export const CASH_STORAGE_KEY = "findrix_cash_first";

export function leerCaja(): CashEntry[] {
  try {
    const raw = JSON.parse(localStorage.getItem(CASH_STORAGE_KEY) ?? "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function guardarCaja(entries: CashEntry[]) {
  localStorage.setItem(CASH_STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent("findrix-cash-updated"));
}

export function saldoEfectivo(entries: CashEntry[]) {
  return entries.reduce((saldo, entry) => saldo + (entry.tipo === "ingreso" ? entry.monto : -entry.monto), 0);
}

export function promedioDiarioGasto(entries: CashEntry[]) {
  const gastos = entries.filter((entry) => entry.tipo === "gasto");
  if (!gastos.length) return 0;
  const dias = new Set(gastos.map((entry) => entry.fecha)).size || 1;
  return gastos.reduce((total, entry) => total + entry.monto, 0) / dias;
}

export function fuenteLabel(fuente: CashEntrySource) {
  return {
    efectivo: "Efectivo",
    propina: "Propina",
    "trabajo-extra": "Trabajo extra",
    whatsapp: "Venta por WhatsApp",
    venta: "Venta directa",
    otro: "Otro",
  }[fuente];
}
