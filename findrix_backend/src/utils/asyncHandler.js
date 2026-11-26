export function asyncHandler(controlador) {
  return function controladorConErrores(req, res, next) {
    Promise.resolve(controlador(req, res, next)).catch(next);
  };
}
