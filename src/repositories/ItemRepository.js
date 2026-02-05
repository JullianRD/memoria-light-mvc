import pool from "../config/database.js";
import { ItemEntity } from "../entities/ItemEntity.js";
import logger from "../config/logger.js";
import { logSlowQuery } from "../utils/logHelper.js";

export class ItemRepository {

      /**
   * Récupère tous les items d'un utilisateur avec leurs tags
   * @param {string} userId - UUID de l'utilisateur
   * @returns {Promise<ItemEntity[]>}
   */
      static async findAll(userId) {
        const start = Date.now(); // C'est pour la perf (pour mesurer le temps de la requête)
        try {
    const query = /*sql*/ `
        SELECT
          i.*,
          COALESCE(
            json_agg(
              json_build_object('id', t.id, 'name', t.name, 'color', t.color)
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'
          ) as tags
        FROM items i
        LEFT JOIN item_tags it ON i.id = it.item_id
        LEFT JOIN tags t ON it.tag_id = t.id
        WHERE i.user_id = $1
        GROUP BY i.id
        ORDER BY i.created_at DESC
      `;
      const result = await pool.query(query, [userId]);

      const duration = Date.now() - start;
      logSlowQuery(query, duration);

      logger.debug( // Pour voir les bug (apparament c'est pro)
        {
          type: "repository_query",
          method: "findAll",
          userId,
          count: result.rows.length,
          duration,
        },
        `Found ${result.rows.length} items`,
      );
        return ItemEntity.fromDatabaseList(result.rows)
        } catch {
      logger.error(
        {
          type: "repository_error",
          method: "findAll",
          error: error.message,
        },
        "Error finding all items",
      );
      throw error;
        }
      }

        static async findById(id, userId) {
            try {
    const query = /*sql*/ `
      SELECT *
      FROM items i
      WHERE i.id_item = $1;
    `;
      const result = await pool.query(query, [id, userId]);
        return ItemEntity.fromDatabaseList(result.rows)
            } catch (error) {
      logger.error(
        {
          type: "repository_error",
          method: "findAll",
          error: error.message,
        },
        "Error finding all items",
      );
      throw error;
            }
  }

  static async create(data) {
        // UUID issu du fichier de seeding (utilisateur de test)
        const SEEDER_USER_ID = "018d5c8e-5678-7001-9001-000000000001";
    
        // ───────────────────────────────────────────────────────────
        // 2. GÉNÉRATION DU SLUG
        // ───────────────────────────────────────────────────────────
    
        // Slug = version URL-friendly du titre
        // Ex: "Mon Titre Génial !" → "mon-titre-genial"
        // Respecte la contrainte NOT NULL de la BDD
        const slug = generateSlug(data.title);
    try {
const query = /*sql*/ `
      INSERT INTO items (
        user_id,
        content_type,
        title,
        slug,
        content,
        source_author
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
       const values = [
      SEEDER_USER_ID, // $1
      data.contentType, // $2
      data.title, // $3
      slug, // $4
      data.content, // $5
      data.sourceAuthor || "N.C", // $6 (valeur par défaut si absent)
    ];
      const result = await pool.query(query, [id, userId]);
        return ItemEntity.fromDatabaseList(result.rows)
    } catch (error) {
        
    }
  }
}
