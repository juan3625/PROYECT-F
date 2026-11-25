const ventanas = new Map();
const DURACION_VENTANA_MS = 15 * 60 * 1000;
const MAX_INTENTOS = 5;

export function limitarRecuperacion(req, res, next) {
  const clave = `${req.ip}:${req.path}`;
  const ahora = Date.now();
  const actual = ventanas.get(clave);
  const ventana = !actual || ahora - actual.inicio >= DURACION_VENTANA_MS
    ? { inicio: ahora, intentos: 0 }
    : actual;

  ventana.intentos += 1;
  ventanas.set(clave, ventana);

  if (ventana.intentos > MAX_INTENTOS) {
    return res.status(429).json({ error: "Demasiados intentos. Espera unos minutos y vuelve a intentarlo." });
  }

  return next();
}
