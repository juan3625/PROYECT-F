// Cliente HTTP central. Todo el frontend habla con el backend a través de
// esta función — así el cambio de URL, headers o manejo de errores se hace
// en un solo lugar.

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export class ApiError extends Error {}

export async function apiFetch<T>(
  ruta: string,
  opciones: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opciones.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, { ...opciones, headers });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
  }

  // Algunas respuestas (ej. errores de red intermedios) no traen JSON.
  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new ApiError(datos?.error ?? "Ocurrió un error inesperado.");
  }

  return datos as T;
}
