import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "La variable DATABASE_URL est manquante dans le fichier .env",
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Nécessaire si la db est en ligne (Render, Neon, Vercel, Supabase)
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Ecouteur simple pour rassurer : "oui, on est connecté"
pool.on("connect", () => {
  console.log("✅ Connecté à PostgreSQL");
});

export default pool;
