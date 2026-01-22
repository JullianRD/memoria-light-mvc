/**
 * TODO_01 : Créer les méthodes d'accès à la base données (compétence 6 -> REV )
 */

import db from "../config/database.js";
import { generateSlug } from "../utils/generateSlug.js";

export class Item {
  constructor(row) {
    // Mapping SQL (snake_case) vers JS (camelCase)
    this.id = row.id_item;
    this.userId = row.user_id;
    this.contentType = row.content_type;
    this.title = row.title;
    this.slug = row.slug;
    this.content = row.content;
    this.sourceAuthor = row.source_author;
    this.thumbnailUrl = row.thumbnail_url;
    this.metadata = row.metadata;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }

  /**
   * Retourne toutes les pépites de la base de données
   * Les pépites sont triées par ordre chronologique inverse (les plus récentes en premier)
   * @returns {Promise<Item[]>} List - Une promesse résolue avec tableau d'objets Item.
   */
  static async findAll() {
    // Prepare ma requête
    const query = /*sql*/ `SELECT * FROM items ORDER BY created_at DESC;`;
    const { rows } = await db.query(query);
    if (rows.length === 0) return null;
    return rows.map((row) => new Item(row));
  }

  /**
   * Retourne une pépite par son identifant.
   * Si la pépite n'existe pas, retourne null
   * @param {string} id - L'identifiant de la pépite. UUIDv7
   * @returns {Promise<Item|Null>} - Une promesse résolue avec l'objet Item correspondant ou null.
   */
  static async findById(id) {
    const query = /*sql*/ `SELECT * FROM items WHERE id_item = $1;`;
    const { rows } = await db.query(query, [id]);
    console.log("Show Item Model :", { rows });
    if (rows.length === 0) return null;
    return new Item(rows[0]);
  }

  /**
   * Crée une nouvelle pépite dasn la base de données.
   * L'identifiant est générée automiquement.
   * La date de création est générée automatiquement
   * @param {object} data
   * @param {string} data.title - Le titre de la pépite.
   * @param {string} data.contentType - Le type de contenu de la pépite (livre, article, note).
   * @param {string} data.content - Le contenu de la pépite.
   * @param {string} [data.sourceAuthor="N.C"] - L'auteur de la source de la pépite.
   * @returns {Promise<Item>} - Une promesse résolue avec l'objet correspondant.
   */
  static async create(data) {
    // Ton UUID issu de tes seeders
    const SEEDER_USER_ID = "018d5c8e-5678-7001-9001-000000000001";

    // Génération du slug basique pour respecter la contrainte NOT NULL
    const slug = generateSlug(data.title)

    const query = /*sql*/ `
      INSERT INTO items (user_id, content_type, title, slug, content, source_author)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      SEEDER_USER_ID,
      data.contentType,
      data.title,
      slug,
      data.content,
      data.sourceAuthor || "N.C",
    ];

    const { rows } = await db.query(query, values);
    return new Item(rows[0]);
  }
 
// Pour supprimer une pépite :
  static async destroy(id) {
    const query = /*sql*/`DELETE FROM items where id_item = $1`
    const result = await db.query(query, [id]);
    // rowCount pour savoir si une ligne a bien été suprimée 
    return result.rowCount > 0
  }
}
