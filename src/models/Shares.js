/**
 * TODO_01 : Créer les méthodes d'accès à la base données (compétence 6 -> REV )
 */

import db from "../config/database.js";
import { generateSlug } from "../utils/generateSlug.js";

export class Share {
  constructor(row) {
    // Mapping SQL (snake_case) vers JS (camelCase)
    this.id = row.id_share;
    this.itemId = row.item_id;
    this.recipientEmail = row.recipient_email
    this.shareToken = row.share_token
    this.accessConfig = row.access_config
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }

  /**
   * Retourne tout les partages de la base de données
   * Les partages sont triés par ordre chronologique inverse (les plus récentes en premier)
   * @returns {Promise<Share[]>} List - Une promesse résolue avec tableau d'objets Share.
   */
  static async findAll() {
    // Prepare ma requête
    const query = /*sql*/ `SELECT * FROM shares ORDER BY created_at DESC;`;
    const { rows } = await db.query(query);
    if (rows.length === 0) return null;
    return rows.map((row) => new Share(row));
  }

  /**
   * Retourne un partage par son identifiant par son identifant.
   * Si le partage n'existe pas, retourne null
   * @param {string} id - L'identifiant du partage. UUIDv7
   * @returns {Promise<Item|Null>} - Une promesse résolue avec l'objet Partage correspondant ou null.
   */
  static async findById(id) {
    const query = /*sql*/ `SELECT * FROM shares WHERE id_share = $1;`;
    const { rows } = await db.query(query, [id]);
    console.log("Show Share Model :", { rows });
    if (rows.length === 0) return null;
    return new Share(rows[0]);
  }

  /**
   * Crée un nouveau tag dans la base de données.
   * L'identifiant est générée automiquement.
   * La date de création est générée automatiquement
   * @param {object} data
   * @param {string} data.tagName - Le titre du tag.
   * @returns {Promise<Item>} - Une promesse résolue avec l'objet correspondant.
   */
  static async create(data) {
    // Ton UUID issu de tes seeders
    const SEEDER_ITEM_ID = "018d5c8e-8001-7001-b001-000000000002";

    // Génération du slug basique pour respecter la contrainte NOT NULL
    const slug = generateSlug(data.recipientEmail);

    const query = /*sql*/ `
      INSERT INTO tags (item_id, recipient_email, share_token)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [
      SEEDER_ITEM_ID,
      data.recipientEmail,
      data.shareToken,
    ];

    const { rows } = await db.query(query, values);
    return new Share(rows[0]);
  }
}
