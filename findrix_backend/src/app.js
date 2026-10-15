import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { apiRoutes } from "./routes/index.js";
import { errorHandler, rutaNoEncontrada } from "./middlewares/errorHandler.js";

export const app = express();

app.use(cors());
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Findrix API", version: "0.1.0" },
    // Los paths de las rutas ya incluyen "/api/..." (ver routes/*.js),
    // así que la URL base del server debe quedar vacía; si no, Swagger
    // duplica el prefijo: /api + /api/auth/registro = /api/api/auth/registro.
    servers: [{ url: "/" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    // Aplica el candado a todos los endpoints por defecto; /auth/* no lo
    // necesita pero no molesta que Swagger lo muestre igual ahí.
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", apiRoutes);

app.use(rutaNoEncontrada);
app.use(errorHandler);
