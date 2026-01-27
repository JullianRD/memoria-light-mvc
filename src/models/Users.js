/**
 * TODO_01 : Créer les méthodes d'accès à la base données (compétence 6 -> REV )
 */

import db from "../config/database.js";
import { generateSlug } from "../utils/generateSlug.js";

export class User {
  constructor(row) {
    // Mapping SQL (snake_case) vers JS (camelCase)
    this.id = row.id_user;
    this.email = row.email
    this.passwordHash = row.password_hash
    this.pseudo = row.pseudo
    this.roleName = row.role_name
    this.auth_provider = row.auth_provider
    this.settingsUser = row.settings_user
    this.gdprConsent = row.gdpr_consent
    this.gdprConsentDate = row.gdpr_consent_date
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }

  /**
   * Retourne tout les users de la base de données
   * Les users sont triés par ordre chronologique inverse (les plus récentes en premier)
   * @returns {Promise<Item[]>} List - Une promesse résolue avec tableau d'objets Item.
   */
  static async findAll() {
    // Prepare ma requête
    const query = /*sql*/ `SELECT * FROM users ORDER BY created_at DESC;`;
    const { rows } = await db.query(query);
    if (rows.length === 0) return null;
    return rows.map((row) => new User(row));
  }

  /**
   * Retourne un user par son identifant.
   * Si l'user n'existe pas, retourne null
   * @param {string} id - L'identifiant du user est en UUIDv7
   * @returns {Promise<Item|Null>} - Une promesse résolue avec l'objet User correspondant ou null.
   */
  static async findById(id) {
    const query = /*sql*/ `SELECT * FROM users WHERE id_user = $1;`;
    const { rows } = await db.query(query, [id]);
    console.log("Show User Model :", { rows });
    if (rows.length === 0) return null;
    return new Tag(rows[0]);
  }

  /**
   * Crée un nouveau tag dans la base de données.
   * L'identifiant est générée automiquement.
   * La date de création est générée automatiquement
   * @param {object} data
   * @param {string} data.userPseudo - Le nom d'un user.
   * @returns {Promise<User>} - Une promesse résolue avec l'objet correspondant.
   */
  static async create(data) {
    // Ton UUID issu de tes seeders
    const SEEDER_USER_ID = "018d5c8e-5678-7001-9001-000000000001";

    // Génération du slug basique pour respecter la contrainte NOT NULL
    const slug = generateSlug(data.tagName);

    const query = /*sql*/ `
      INSERT INTO tags (email, password_hash, pseudo, role_name, auth_provider, settings_user, gdpr_consent)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      SEEDER_USER_ID,
      data.email,
      data.passwordHash,
      data.pseudo,
      data.roleName,
      data.auth_provider,
      data.settingsUser,
      data.gdprConsent,
    ];

    const { rows } = await db.query(query, values);
    return new Tag(rows[0]);
  }

  static async update(id, data) {
    const slug = generateSlug(data.title);
    const query = /*sql*/ `
    UPDATE tags
    SET 
    tagName = COALESCE($1, tag_name),
    WHERE id_item = $2
    RETURNING *;
    `;

    const values = [
      data.tagName,
      slug,
    ];

    const { rows } = await db.query(query, values);
    return rows[0] ? new Tag(rows[0]) : null
  }

  static async destroy(id) {
    const query = /*sql*/ `DELETE FROM tags WHERE id_tag = $1;`;
    const result = await db.query(query, [id]);
    // rowCount permet de savoir si une ligne a bien été supprimée
    return result.rowCount > 0;
  }
}
