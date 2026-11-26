import test from "node:test";
import assert from "node:assert/strict";
import { registroSchema, loginSchema } from "../src/schemas/auth.schema.js";

test("registro acepta datos válidos", () => {
  const { error, value } = registroSchema.validate({
    nombre: "Juan Felipe",
    correo: "juan@example.com",
    contrasena: "segura123",
  });

  assert.equal(error, undefined);
  assert.equal(value.correo, "juan@example.com");
});

test("registro rechaza contraseña menor de ocho caracteres", () => {
  const { error } = registroSchema.validate({
    nombre: "Juan Felipe",
    correo: "juan@example.com",
    contrasena: "1234567",
  });

  assert.ok(error);
});

test("registro rechaza correo inválido", () => {
  const { error } = registroSchema.validate({
    nombre: "Juan Felipe",
    correo: "correo-no-valido",
    contrasena: "segura123",
  });

  assert.ok(error);
});

test("login acepta correo válido y contraseña presente", () => {
  const { error } = loginSchema.validate({
    correo: "juan@example.com",
    contrasena: "segura123",
  });

  assert.equal(error, undefined);
});

test("login rechaza correo ausente", () => {
  const { error } = loginSchema.validate({ contrasena: "segura123" });

  assert.ok(error);
});
