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
    return rows[0] ? new User(rows[0]) : null
  }

  /**
   * Crée un nouveau tag dans la base de données.
   * L'identifiant est généré automiquement.
   * La date de création est générée automatiquement (y)
   * @param {object} data
   * @param {string} data.userPseudo - Le nom d'un user.
   * @returns {Promise<User>} - Une promesse résolue avec l'objet correspondant.
   */
  static async create(data) {

    // Génération du slug basique pour respecter la contrainte NOT NULL

    const query = /*sql*/ `
      INSERT INTO users (email, password_hash, pseudo, role_name, auth_provider)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      data.email,
      data.passwordHash,
      data.pseudo,
      "customer",        // 🔒 valeur ENUM sûre
      "local"        // 🔒 valeur contrôlée
    ];

    const { rows } = await db.query(query, values);
    return new User(rows[0]);
  }

  static async updateUser(id, data) {
    const query = /*sql*/ `
    UPDATE users
    SET 
    pseudo = COALESCE($1, pseudo),
    email = COALESCE($2, email)
    WHERE id_user = $3
    RETURNING *;
    `;

    const values = [
      data.pseudo,
      data.email,
      id
    ];

    const { rows } = await db.query(query, values);
    return rows[0] ? new User(rows[0]) : null
  }

  static async destroy(id) {
    const query = /*sql*/ `DELETE FROM users WHERE id_user = $1;`;
    const result = await db.query(query, [id]);
    // rowCount permet de savoir si une ligne a bien été supprimée
    return result.rowCount > 0;
  }
}
