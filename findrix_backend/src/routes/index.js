import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { categoriaRoutes } from "./categoria.routes.js";
import { gastoRoutes } from "./gasto.routes.js";
import { ingresoRoutes } from "./ingreso.routes.js";
import { metaAhorroRoutes } from "./metaAhorro.routes.js";
import { prestamoRoutes } from "./prestamo.routes.js";
import { requiereAuth } from "../middlewares/auth.js";

export const apiRoutes = Router();

// Único grupo de rutas público — todo lo demás pasa por requiereAuth.
apiRoutes.use("/auth", authRoutes);

apiRoutes.use("/categorias", requiereAuth, categoriaRoutes);
apiRoutes.use("/gastos", requiereAuth, gastoRoutes);
apiRoutes.use("/ingresos", requiereAuth, ingresoRoutes);
apiRoutes.use("/metas-ahorro", requiereAuth, metaAhorroRoutes);
apiRoutes.use("/prestamos", requiereAuth, prestamoRoutes);
