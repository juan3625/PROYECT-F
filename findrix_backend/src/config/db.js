import pg from "pg";
import "dotenv/config";

pg.types.setTypeParser(1082, (valor) => valor);

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  // Error en un cliente inactivo del pool: no debe tumbar el proceso.
  console.error("Error inesperado en el pool de PostgreSQL", err);
});
