'use strict'
// src/config/database.js


import pg from "pg";
import { logger } from "./logger.js"


import "dotenv/config";


const { Pool } = pg;


if (!process.env.DATABASE_URL) {
  const errorMsg =
    "La variable DATABASE_URL est manquante dans le fichier .env";
    logger.fatal(errorMsg);
  throw new Error(errorMsg);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
      max: 20,
      idleTimeoutMillis: 30000,
});

// Evenements du pool pour le monitoring
pool.on("connect", () => {
  logger.debug("😈 Connecté à PostgreSQL")
});

pool.on("error", (err) => {
  logger.error({ err }), "Unexpected error on idle database client";
  process.exit(-1); // En cas de perte critique de DB, mieux vaut redemarrer l'app
});

export default pool;
