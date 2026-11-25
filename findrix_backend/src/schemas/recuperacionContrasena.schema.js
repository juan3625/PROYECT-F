import Joi from "joi";

export const olvideContrasenaSchema = Joi.object({
  correo: Joi.string().trim().lowercase().email().required(),
});

export const restablecerContrasenaSchema = Joi.object({
  token: Joi.string().hex().length(64).required(),
  contrasena: Joi.string().min(8).max(128).required(),
});
