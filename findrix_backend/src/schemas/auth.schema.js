import Joi from "joi";

export const registroSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(100).required(),
  correo: Joi.string().trim().lowercase().email().required(),
  contrasena: Joi.string().min(8).required(),
});

export const loginSchema = Joi.object({
  correo: Joi.string().trim().lowercase().email().required(),
  contrasena: Joi.string().required(),
});
