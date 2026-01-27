/**
 * @fileoverview Configuration et création d'un pool de connexions PostgreSQL
 *
 * Ce fichier centralise la configuration de la base de données PostgreSQL.
 * Il utilise un "pool" de connexions pour optimiser les performances :
 * au lieu de créer une nouvelle connexion à chaque requête,
 * le pool maintient plusieurs connexions ouvertes et réutilisables.
 */

// Import du module PostgreSQL pour Node.js
import pg from "pg";

// Import de dotenv pour charger les variables d'environnement depuis le fichier .env
import "dotenv/config";

/**
 * Destructuration pour extraire la classe Pool du module pg
 * Pool = gestionnaire de connexions multiples à la base de données
 */
const { Pool } = pg;

/**
 * Vérification de sécurité : s'assurer que l'URL de connexion existe
 *
 * DATABASE_URL contient toutes les infos de connexion :
 * postgresql://user:password@host:port/database
 *
 * Si elle manque, on arrête immédiatement l'application
 * plutôt que de crasher plus tard avec une erreur cryptique
 */
if (!process.env.DATABASE_URL) {
  throw new Error(
    "La variable DATABASE_URL est manquante dans le fichier .env",
  );
}

/**
 * Création du pool de connexions PostgreSQL
 *
 * @type {pg.Pool}
 * @description Pool principal pour toutes les interactions avec la base de données.
 * Un pool maintient plusieurs connexions ouvertes (par défaut 10 max)
 * et les distribue aux requêtes qui en ont besoin.
 *
 * Avantages du pool :
 * - Réutilisation des connexions (plus rapide)
 * - Gestion automatique des connexions (ouverture/fermeture)
 * - Limitation du nombre de connexions simultanées (évite la surcharge)
 */
const pool = new Pool({
  /**
   * URL de connexion à la base de données
   * Format : postgresql://username:password@host:port/database_name
   */
  connectionString: process.env.DATABASE_URL,

  /**
   * Configuration SSL (Secure Socket Layer) pour les connexions sécurisées
   *
   * En PRODUCTION :
   * - ssl: { rejectUnauthorized: false }
   *   Active SSL mais n'exige pas de certificat vérifié
   *   Nécessaire pour des services comme Render, Neon, Vercel, Supabase
   *
   * En DÉVELOPPEMENT (local) :
   * - ssl: false
   *   Pas de SSL nécessaire pour une base de données locale
   *
   * Note : rejectUnauthorized: false est acceptable pour des bases hébergées
   * car on fait confiance au fournisseur, mais ce n'est pas idéal pour
   * une sécurité maximale
   */
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

/**
 * Écouteur d'événement "connect"
 *
 * Chaque fois qu'une nouvelle connexion physique est établie avec PostgreSQL,
 * cet événement est déclenché. Utile pour :
 * - Déboguer (savoir quand la connexion s'établit)
 * - Rassurer le développeur que tout fonctionne
 * - Logger les connexions en production
 *
 * Note : cet événement se déclenche pour chaque connexion dans le pool,
 * pas juste une fois au démarrage
 */
pool.on("connect", () => {
  console.log("✅ Connecté à PostgreSQL");
});

/**
 * Export du pool pour l'utiliser dans d'autres fichiers
 *
 * @example
 * // Dans un autre fichier :
 * import pool from './database.js';
 *
 * const result = await pool.query('SELECT * FROM users');
 * console.log(result.rows);
 */
export default pool;
