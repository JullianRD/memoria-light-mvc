/**
 * @fileoverview Modèle User - Gestion des utilisateurs et authentification
 * @module models/User
 * @security Contient des données sensibles (password_hash) - Utiliser toJSON() ou DTO
 *
 * 🔐 HASH PASSWORDS :
 * - Argon2id via @node-rs/argon2 (Rust binding, +rapide que node-argon2)
 * - Hash géré par AuthController (pas ici)
 * - Vérification via verify() dans AuthController
 */

import { hash, verify, Algorithm } from "@node-rs/argon2";
import db from "../config/database.js";

/**
 * Configuration Argon2 (OWASP recommendations)
 * ⚠️ À utiliser UNIQUEMENT pour les rehash automatiques
 */
const ARGON2_OPTIONS = {
  algorithm: Algorithm.Argon2id, // ✅ Correct pour @node-rs/argon2
  memoryCost: 65536, // 64 MB
  timeCost: 3, // 3 itérations
  parallelism: 4, // 4 threads
};

export class User {
  constructor(row) {
    // Mapping SQL (snake_case) vers JS (camelCase)
    this.id = row.id_user;
    this.email = row.email;
    this.passwordHash = row.password_hash; // ⚠️ SENSIBLE - Ne jamais exposer en API
    this.pseudo = row.pseudo;
    this.roleName = row.role_name;
    this.authProvider = row.auth_provider;
    this.settingsUser = row.settings_user;
    this.gdprConsent = row.gdpr_consent;
    this.gdprConsentDate = row.gdpr_consent_date;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;

    // Statistiques (si agrégation effectuée)
    if (row.items_count !== undefined) {
      this.itemsCount = parseInt(row.items_count, 10);
    }
    if (row.tags_count !== undefined) {
      this.tagsCount = parseInt(row.tags_count, 10);
    }
  }

  /**
   * Filtre les données sensibles pour l'exposition en API
   * @returns {object} - Objet User sans données sensibles
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      pseudo: this.pseudo,
      roleName: this.roleName,
      authProvider: this.authProvider,
      settingsUser: this.settingsUser,
      gdprConsent: this.gdprConsent,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      // ❌ passwordHash exclu
      // ❌ gdprConsentDate exclu (donnée interne)
      ...(this.itemsCount !== undefined && { itemsCount: this.itemsCount }),
      ...(this.tagsCount !== undefined && { tagsCount: this.tagsCount }),
    };
  }

  /**
   * Retourne tous les utilisateurs (ADMIN ONLY)
   * ⚠️ Ne JAMAIS exposer publiquement
   * @returns {Promise<User[]|null>} - Tableau d'objets User ou null
   */
  static async findAll() {
    const query = /*sql*/ `
      SELECT
        id_user,
        email,
        pseudo,
        role_name,
        auth_provider,
        settings_user,
        gdpr_consent,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC;
    `;

    const { rows } = await db.query(query);
    if (rows.length === 0) return null;
    return rows.map((row) => new User(row));
  }

  /**
   * Retourne un User par son identifiant
   * ⚠️ Contient password_hash - Utiliser toJSON() avant exposition
   * @param {string} id - L'identifiant de l'utilisateur (UUIDv7)
   * @returns {Promise<User|null>} - Objet User ou null
   */
  static async findById(id) {
    const query = /*sql*/ `
      SELECT
        id_user,
        email,
        password_hash,
        pseudo,
        role_name,
        auth_provider,
        settings_user,
        gdpr_consent,
        gdpr_consent_date,
        created_at,
        updated_at
      FROM users
      WHERE id_user = $1;
    `;

    const { rows } = await db.query(query, [id]);
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  /**
   * Retourne un User par email (pour authentification)
   * ⚠️ Contient password_hash pour vérification Argon2
   * @param {string} email - L'email de l'utilisateur
   * @returns {Promise<User|null>} - Objet User avec password_hash ou null
   */
  static async findByEmail(email) {
    const query = /*sql*/ `
      SELECT
        id_user,
        email,
        password_hash,
        pseudo,
        role_name,
        auth_provider,
        settings_user,
        gdpr_consent,
        gdpr_consent_date,
        created_at,
        updated_at
      FROM users
      WHERE LOWER(email) = LOWER($1);
    `;

    const { rows } = await db.query(query, [email]);
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  /**
   * Vérifie si un email existe déjà
   * @param {string} email - L'email à vérifier
   * @returns {Promise<boolean>} - true si existe, false sinon
   */
  static async existsByEmail(email) {
    const query = /*sql*/ `
      SELECT EXISTS(
        SELECT 1 FROM users
        WHERE LOWER(email) = LOWER($1)
      ) AS exists;
    `;

    const { rows } = await db.query(query, [email]);
    return rows[0].exists;
  }

  /**
   * Vérifie si un pseudo existe déjà
   * @param {string} pseudo - Le pseudo à vérifier
   * @returns {Promise<boolean>} - true si existe, false sinon
   */
  static async existsByPseudo(pseudo) {
    const query = /*sql*/ `
      SELECT EXISTS(
        SELECT 1 FROM users
        WHERE LOWER(pseudo) = LOWER($1)
      ) AS exists;
    `;

    const { rows } = await db.query(query, [pseudo]);
    return rows[0].exists;
  }

  /**
   * Crée un nouvel utilisateur dans la base de données
   * ⚠️ Vérifie les doublons email/pseudo avant création
   * ⚠️ Le passwordHash doit être hashé AVANT (via AuthController)
   *
   * @param {object} data - Données de l'utilisateur
   * @param {string} data.email - Email unique
   * @param {string} data.passwordHash - Mot de passe DÉJÀ HASHÉ avec Argon2
   * @param {string} data.pseudo - Pseudo unique
   * @param {boolean} data.gdprConsent - Consentement RGPD (obligatoire)
   * @param {string} [data.authProvider='local'] - Fournisseur d'authentification
   * @param {object} [data.settingsUser] - Préférences utilisateur
   * @returns {Promise<User>} - L'utilisateur créé
   * @throws {Error} Si email/pseudo déjà utilisé ou RGPD non accepté
   */
  static async create(data) {
    // Validation RGPD (obligatoire)
    if (!data.gdprConsent) {
      throw new Error(
        "Le consentement RGPD est obligatoire pour créer un compte",
      );
    }

    // ⚠️ Vérification que le hash est bien fourni
    if (!data.passwordHash && data.authProvider === "local") {
      throw new Error(
        "Le mot de passe doit être hashé AVANT d'appeler User.create()",
      );
    }

    // Vérification des doublons email
    const emailExists = await this.existsByEmail(data.email);
    if (emailExists) {
      throw new Error("Cet email est déjà utilisé");
    }

    // Vérification des doublons pseudo
    const pseudoExists = await this.existsByPseudo(data.pseudo);
    if (pseudoExists) {
      throw new Error("Ce pseudo est déjà utilisé");
    }

    // Settings par défaut
    const settingsUser = {
      theme: data.settingsUser?.theme || "light",
      language: data.settingsUser?.language || "fr",
      emailDigest: data.settingsUser?.emailDigest || "weekly",
      notifications: data.settingsUser?.notifications !== false,
    };

    const query = /*sql*/ `
      INSERT INTO users (
        email,
        password_hash,
        pseudo,
        auth_provider,
        settings_user,
        gdpr_consent
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id_user,
        email,
        pseudo,
        role_name,
        auth_provider,
        settings_user,
        gdpr_consent,
        gdpr_consent_date,
        created_at,
        updated_at;
    `;

    const values = [
      data.email.toLowerCase().trim(),
      data.passwordHash, // DÉJÀ HASHÉ par AuthController
      data.pseudo.trim(),
      data.authProvider || "local",
      JSON.stringify(settingsUser),
      data.gdprConsent,
    ];

    const { rows } = await db.query(query, values);
    return new User(rows[0]);
  }

  /**
   * Met à jour un utilisateur existant
   * ⚠️ Vérifie les doublons email/pseudo si modifiés
   * ⚠️ Si passwordHash fourni, il doit être DÉJÀ HASHÉ
   *
   * @param {string} id - L'identifiant de l'utilisateur (UUIDv7)
   * @param {object} data - Nouvelles données
   * @param {string} [data.email] - Nouvel email
   * @param {string} [data.passwordHash] - Nouveau mot de passe DÉJÀ HASHÉ
   * @param {string} [data.pseudo] - Nouveau pseudo
   * @param {object} [data.settingsUser] - Nouvelles préférences
   * @returns {Promise<User|null>} - Utilisateur mis à jour ou null
   * @throws {Error} Si email/pseudo déjà utilisé par un autre compte
   */
  static async update(id, data) {
    const existingUser = await this.findById(id);
    if (!existingUser) return null;

    // Vérification doublon email (si changement)
    if (
      data.email &&
      data.email.toLowerCase() !== existingUser.email.toLowerCase()
    ) {
      const emailExists = await this.existsByEmail(data.email);
      if (emailExists) {
        throw new Error("Cet email est déjà utilisé par un autre compte");
      }
    }

    // Vérification doublon pseudo (si changement)
    if (
      data.pseudo &&
      data.pseudo.toLowerCase() !== existingUser.pseudo.toLowerCase()
    ) {
      const pseudoExists = await this.existsByPseudo(data.pseudo);
      if (pseudoExists) {
        throw new Error("Ce pseudo est déjà utilisé par un autre compte");
      }
    }

    const query = /*sql*/ `
      UPDATE users
      SET
        email = COALESCE($1, email),
        password_hash = COALESCE($2, password_hash),
        pseudo = COALESCE($3, pseudo),
        settings_user = COALESCE($4, settings_user)::jsonb,
        updated_at = NOW()
      WHERE id_user = $5
      RETURNING
        id_user,
        email,
        pseudo,
        role_name,
        auth_provider,
        settings_user,
        gdpr_consent,
        gdpr_consent_date,
        created_at,
        updated_at;
    `;

    const values = [
      data.email?.toLowerCase().trim(),
      data.passwordHash, // DÉJÀ HASHÉ si fourni
      data.pseudo?.trim(),
      data.settingsUser ? JSON.stringify(data.settingsUser) : null,
      id,
    ];

    const { rows } = await db.query(query, values);
    return rows[0] ? new User(rows[0]) : null;
  }

  /**
   * Met à jour uniquement les préférences utilisateur
   * @param {string} id - L'identifiant de l'utilisateur (UUIDv7)
   * @param {object} settings - Nouvelles préférences (merge avec existantes)
   * @returns {Promise<User|null>} - Utilisateur mis à jour ou null
   */
  static async updateSettings(id, settings) {
    const query = /*sql*/ `
      UPDATE users
      SET
        settings_user = settings_user || $1::jsonb,
        updated_at = NOW()
      WHERE id_user = $2
      RETURNING
        id_user,
        email,
        pseudo,
        role_name,
        auth_provider,
        settings_user,
        gdpr_consent,
        created_at,
        updated_at;
    `;

    const values = [JSON.stringify(settings), id];

    const { rows } = await db.query(query, values);
    return rows[0] ? new User(rows[0]) : null;
  }

  /**
   * Supprime un utilisateur de la base de données (RGPD)
   * ⚠️ Suppression en CASCADE : items, tags, shares, item_tags
   * @param {string} id - L'identifiant de l'utilisateur (UUIDv7)
   * @returns {Promise<boolean>} - true si supprimé, false sinon
   */
  static async delete(id) {
    const query = /*sql*/ `
      DELETE FROM users
      WHERE id_user = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Retourne un utilisateur avec ses statistiques
   * @param {string} id - L'identifiant de l'utilisateur (UUIDv7)
   * @returns {Promise<User|null>} - User avec itemsCount et tagsCount
   */
  static async findByIdWithStats(id) {
    const query = /*sql*/ `
      SELECT
        u.id_user,
        u.email,
        u.pseudo,
        u.role_name,
        u.auth_provider,
        u.settings_user,
        u.gdpr_consent,
        u.created_at,
        u.updated_at,
        COUNT(DISTINCT i.id_item) AS items_count,
        COUNT(DISTINCT t.id_tag) AS tags_count
      FROM users u
      LEFT JOIN items i ON u.id_user = i.user_id
      LEFT JOIN tags t ON u.id_user = t.user_id
      WHERE u.id_user = $1
      GROUP BY u.id_user;
    `;

    const { rows } = await db.query(query, [id]);
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  /**
   * Export RGPD - Toutes les données utilisateur
   * @param {string} id - L'identifiant de l'utilisateur (UUIDv7)
   * @returns {Promise<object|null>} - Objet complet pour export JSON
   */
  static async exportUserData(id) {
    const userQuery = /*sql*/ `
      SELECT
        id_user, email, pseudo, role_name, auth_provider,
        settings_user, gdpr_consent, gdpr_consent_date,
        created_at, updated_at
      FROM users WHERE id_user = $1;
    `;

    const itemsQuery = /*sql*/ `
      SELECT * FROM items WHERE user_id = $1;
    `;

    const tagsQuery = /*sql*/ `
      SELECT * FROM tags WHERE user_id = $1;
    `;

    const sharesQuery = /*sql*/ `
      SELECT s.* FROM shares s
      JOIN items i ON s.item_id = i.id_item
      WHERE i.user_id = $1;
    `;

    const [user, items, tags, shares] = await Promise.all([
      db.query(userQuery, [id]),
      db.query(itemsQuery, [id]),
      db.query(tagsQuery, [id]),
      db.query(sharesQuery, [id]),
    ]);

    if (user.rows.length === 0) return null;

    return {
      user: user.rows[0],
      items: items.rows,
      tags: tags.rows,
      shares: shares.rows,
      exportDate: new Date().toISOString(),
    };
  }

  /**
   * Compte le nombre total d'utilisateurs
   * @returns {Promise<number>} - Nombre total d'utilisateurs
   */
  static async count() {
    const query = /*sql*/ `
      SELECT COUNT(*) as count FROM users;
    `;

    const { rows } = await db.query(query);
    return parseInt(rows[0].count, 10);
  }

  /**
   * Compte les utilisateurs par provider
   * @returns {Promise<object>} - { local: 10, google: 5, ... }
   */
  static async countByProvider() {
    const query = /*sql*/ `
      SELECT
        auth_provider,
        COUNT(*) as count
      FROM users
      GROUP BY auth_provider;
    `;

    const { rows } = await db.query(query);
    return rows.reduce((acc, row) => {
      acc[row.auth_provider] = parseInt(row.count, 10);
      return acc;
    }, {});
  }
}
