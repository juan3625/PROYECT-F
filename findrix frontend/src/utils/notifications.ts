import type { Gasto, Prestamo } from "../types";

export interface AvisoFinanciero {
  id: string;
  clave: string;
  tipo: "gasto" | "prestamo";
  titulo: string;
  detalle: string;
  urgente: boolean;
}

function fechaLocalSinHora(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

function fechaISOHoy(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function diferenciaDias(fechaISO: string): number {
  const [anio, mes, dia] = fechaISO.split("-").map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  const hoy = fechaLocalSinHora(new Date());
  return Math.round((fecha.getTime() - hoy.getTime()) / 86_400_000);
}

function textoVencimiento(dias: number): string {
  if (dias < 0) return `Vencido hace ${Math.abs(dias)} día${Math.abs(dias) === 1 ? "" : "s"}`;
  if (dias === 0) return "Vence hoy";
  if (dias === 1) return "Vence mañana";
  return `Vence en ${dias} días`;
}

export function calcularAvisos(
  gastos: Gasto[],
  prestamos: Prestamo[],
  diasAnticipacion: number
): AvisoFinanciero[] {
  const avisos: AvisoFinanciero[] = [];
  const hoy = fechaISOHoy();

  gastos
    .filter((gasto) => gasto.esPagoPendiente && gasto.estado === "pendiente" && gasto.fechaVencimiento)
    .forEach((gasto) => {
      const dias = diferenciaDias(gasto.fechaVencimiento!);
      if (dias <= diasAnticipacion) {
        avisos.push({
          id: gasto.id,
          clave: `gasto:${gasto.id}:${hoy}`,
          tipo: "gasto",
          titulo: gasto.descripcion || "Gasto pendiente",
          detalle: `${textoVencimiento(dias)}${gasto.monto ? ` · $${gasto.monto.toLocaleString("es-CO")}` : ""}`,
          urgente: dias <= 0,
        });
      }
    });

  prestamos
    .filter((prestamo) => prestamo.montoActual < prestamo.montoTotal)
    .forEach((prestamo) => {
      avisos.push({
        id: prestamo.id,
        clave: `prestamo:${prestamo.id}:${hoy}`,
        tipo: "prestamo",
        titulo: `Préstamo pendiente: ${prestamo.nombre}`,
        detalle: "Revisa el saldo pendiente y registra un abono cuando corresponda.",
        urgente: false,
      });
    });

  return avisos;
}

export function leerAvisosEmitidos(claveUsuario: string): string[] {
  try {
    const guardados = JSON.parse(localStorage.getItem(`findrix_avisos_${claveUsuario}`) ?? "[]");
    return Array.isArray(guardados) ? guardados : [];
  } catch {
    return [];
  }
}

export function guardarAvisoEmitido(claveUsuario: string, claveAviso: string, existentes: string[]) {
  const actualizados = [...new Set([...existentes, claveAviso])].slice(-200);
  localStorage.setItem(`findrix_avisos_${claveUsuario}`, JSON.stringify(actualizados));
  return actualizados;
}
