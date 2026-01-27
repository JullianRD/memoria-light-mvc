/**
 * @fileoverview Modèle de données pour les Items (Pépites)
 *
 * 🎯 RÔLE DU MODÈLE :
 * Le modèle est la SEULE couche qui communique avec la base de données.
 * Il encapsule toutes les requêtes SQL et transforme les résultats en objets JavaScript.
 *
 * 🏗️ ARCHITECTURE :
 * - Utilise le pattern Active Record (méthodes statiques)
 * - Transforme les données SQL (snake_case) en objets JS (camelCase)
 * - Gère automatiquement les UUIDs et timestamps
 *
 * 📋 MÉTHODES CRUD IMPLÉMENTÉES :
 * - findAll()  : Récupère toutes les pépites
 * - findById() : Récupère une pépite par son ID
 * - create()   : Crée une nouvelle pépite
 * - update()   : Met à jour une pépite existante
 * - delete()   : Supprime une pépite
 *
 * TODO_01 : Créer les méthodes d'accès à la base données (compétence 6 -> REV)
 */

// Import du pool de connexions PostgreSQL
import db from "../config/database.js";

// Import de l'utilitaire de génération de slug
// Un slug est une version URL-friendly d'un titre : "Mon Titre" → "mon-titre"
import { generateSlug } from "../utils/generateSlug.js";

/**
 * @class Item
 * @description Représente une "Pépite" (élément de connaissance) dans l'application
 *
 * 💡 PATTERN UTILISÉ : Active Record
 * - Le modèle contient à la fois les données ET les méthodes pour les manipuler
 * - Toutes les méthodes sont statiques (pas besoin de `new Item()`)
 *
 * 🔄 MAPPING DES DONNÉES :
 * PostgreSQL utilise snake_case (id_item, created_at)
 * JavaScript utilise camelCase (idItem, createdAt)
 * Le constructeur fait la conversion automatiquement
 */
export class Item {
  /**
   * Constructeur - Transforme une ligne SQL en objet JavaScript
   *
   * @constructor
   * @param {Object} row - Ligne brute issue de PostgreSQL
   * @param {string} row.id_item - ID unique (UUIDv7)
   * @param {string} row.user_id - ID de l'utilisateur propriétaire
   * @param {string} row.content_type - Type de contenu (livre, article, note)
   * @param {string} row.title - Titre de la pépite
   * @param {string} row.slug - Version URL-friendly du titre
   * @param {string} row.content - Contenu principal
   * @param {string} row.source_author - Auteur de la source
   * @param {string} row.thumbnail_url - URL de l'image miniature
   * @param {Object} row.metadata - Métadonnées JSON
   * @param {Date} row.created_at - Date de création
   * @param {Date} row.updated_at - Date de dernière mise à jour
   *
   * @example
   * // Ligne SQL brute
   * const sqlRow = {
   *   id_item: '018d5c8e-1234-7001-8001-000000000001',
   *   user_id: '018d5c8e-5678-7001-9001-000000000001',
   *   content_type: 'livre',
   *   title: 'Clean Code',
   *   // ... autres champs
   * };
   *
   * // Transformation en objet JS
   * const item = new Item(sqlRow);
   * console.log(item.idItem); // Notation camelCase
   */
  constructor(row) {
    // ═══════════════════════════════════════════════════════════
    // MAPPING SQL → JavaScript
    // ═══════════════════════════════════════════════════════════

    // 🔑 ID unique de la pépite (UUIDv7)
    this.id = row.id_item;

    // 👤 ID de l'utilisateur propriétaire
    this.userId = row.user_id;

    // 📚 Type de contenu : "livre", "article", "note", "video"
    this.contentType = row.content_type;

    // 📝 Titre de la pépite
    this.title = row.title;

    // 🔗 Slug pour URL (ex: "mon-titre-genial")
    this.slug = row.slug;

    // 📄 Contenu principal (texte long)
    this.content = row.content;

    // ✍️ Auteur de la source (livre, article...)
    this.sourceAuthor = row.source_author;

    // 🖼️ URL de l'image miniature
    this.thumbnailUrl = row.thumbnail_url;

    // 🏷️ Métadonnées additionnelles (format JSON)
    this.metadata = row.metadata;

    // 📅 Date de création (générée par PostgreSQL)
    this.createdAt = row.created_at;

    // 🔄 Date de dernière modification
    this.updatedAt = row.updated_at;
  }

  // ═══════════════════════════════════════════════════════════
  // MÉTHODES STATIQUES CRUD
  // ═══════════════════════════════════════════════════════════

  /**
   * 📋 Récupère toutes les pépites (READ all)
   *
   * @static
   * @async
   * @method findAll
   * @returns {Promise<Item[]|null>} Tableau d'objets Item ou null si aucune pépite
   *
   * @description
   * - Récupère TOUTES les pépites de la base
   * - Les trie par date décroissante (plus récentes en premier)
   * - Transforme chaque ligne SQL en instance Item
   *
   * @example
   * // Dans le contrôleur
   * const items = await Item.findAll();
   * console.log(items); // [Item, Item, Item...]
   *
   * @throws {Error} Si la connexion à la base de données échoue
   */
  static async findAll() {
    // ───────────────────────────────────────────────────────────
    // 1. PRÉPARATION DE LA REQUÊTE SQL
    // ───────────────────────────────────────────────────────────

    // Commentaire /*sql*/ pour l'extension VSCode "es6-string-html"
    // → Active la coloration syntaxique SQL dans les template literals
    const query = /*sql*/ `
      SELECT *
      FROM items
      ORDER BY created_at DESC;
    `;
    // ORDER BY created_at DESC → Tri du plus récent au plus ancien

    // ───────────────────────────────────────────────────────────
    // 2. EXÉCUTION DE LA REQUÊTE
    // ───────────────────────────────────────────────────────────

    // db.query() retourne un objet avec plusieurs propriétés
    // On utilise la déstructuration pour extraire uniquement `rows`
    const { rows } = await db.query(query);
    // rows = tableau d'objets bruts issus de PostgreSQL

    // ───────────────────────────────────────────────────────────
    // 3. GESTION DU CAS "AUCUN RÉSULTAT"
    // ───────────────────────────────────────────────────────────

    // Si la table est vide, on retourne null plutôt qu'un tableau vide
    // Cela permet au contrôleur de différencier "vide" de "erreur"
    if (rows.length === 0) return null;

    // ───────────────────────────────────────────────────────────
    // 4. TRANSFORMATION EN OBJETS ITEM
    // ───────────────────────────────────────────────────────────

    // .map() transforme chaque ligne SQL en instance Item
    // Cela convertit automatiquement snake_case → camelCase
    return rows.map((row) => new Item(row));

    // Résultat : [Item { id: '...', title: '...', ... }, ...]
  }

  /**
   * 🔍 Récupère une pépite par son ID (READ one)
   *
   * @static
   * @async
   * @method findById
   * @param {string} id - Identifiant unique de la pépite (UUIDv7)
   * @returns {Promise<Item|null>} Instance Item ou null si non trouvée
   *
   * @description
   * - Recherche une pépite précise par son UUID
   * - Retourne null si l'ID n'existe pas (plutôt que de lever une erreur)
   * - Transforme la ligne SQL en objet Item
   *
   * @example
   * const item = await Item.findById('018d5c8e-1234-7001-8001-000000000001');
   * if (!item) {
   *   console.log('Pépite introuvable');
   * } else {
   *   console.log(item.title);
   * }
   *
   * @throws {Error} Si l'ID est dans un format invalide ou si erreur BDD
   */
  static async findById(id) {
    // ───────────────────────────────────────────────────────────
    // 1. REQUÊTE PRÉPARÉE (Protection contre les injections SQL)
    // ───────────────────────────────────────────────────────────

    // $1 est un placeholder (paramètre)
    // PostgreSQL l'échappera automatiquement → sécurité !
    const query = /*sql*/ `
      SELECT *
      FROM items
      WHERE id_item = $1;
    `;

    // ───────────────────────────────────────────────────────────
    // 2. EXÉCUTION AVEC PARAMÈTRE
    // ───────────────────────────────────────────────────────────

    // Le tableau [id] correspond aux $1, $2, $3... dans la requête
    // Ici : $1 = id fourni en paramètre
    const { rows } = await db.query(query, [id]);

    // ───────────────────────────────────────────────────────────
    // 3. LOG DE DÉBOGAGE
    // ───────────────────────────────────────────────────────────

    // ⚠️ À supprimer en production ou utiliser un logger
    console.log("Show Item Model :", { rows });

    // ───────────────────────────────────────────────────────────
    // 4. GESTION DU CAS "NON TROUVÉ"
    // ───────────────────────────────────────────────────────────

    // rows.length === 0 signifie qu'aucun item ne correspond à cet ID
    if (rows.length === 0) return null;

    // ───────────────────────────────────────────────────────────
    // 5. RETOUR DE L'OBJET ITEM
    // ───────────────────────────────────────────────────────────

    // rows[0] car la requête WHERE id ne peut retourner qu'1 ligne maximum
    return new Item(rows[0]);
  }

  /**
   * ➕ Crée une nouvelle pépite (CREATE)
   *
   * @static
   * @async
   * @method create
   * @param {Object} data - Données de la pépite à créer
   * @param {string} data.title - Titre de la pépite (obligatoire)
   * @param {string} data.contentType - Type : "livre", "article", "note", "video"
   * @param {string} data.content - Contenu principal (obligatoire)
   * @param {string} [data.sourceAuthor="N.C"] - Auteur de la source (optionnel)
   * @returns {Promise<Item>} L'objet Item nouvellement créé
   *
   * @description
   * - Génère automatiquement un UUIDv7 (via PostgreSQL)
   * - Génère automatiquement un slug basé sur le titre
   * - Associe la pépite à un utilisateur par défaut (SEEDER_USER_ID)
   * - Les dates created_at et updated_at sont gérées par PostgreSQL
   *
   * @example
   * const newItem = await Item.create({
   *   title: "Les Promesses en JavaScript",
   *   contentType: "article",
   *   content: "Les promesses permettent de gérer l'asynchrone...",
   *   sourceAuthor: "MDN Web Docs"
   * });
   * console.log(newItem.id); // UUID généré automatiquement
   *
   * @throws {Error} Si un champ obligatoire est manquant ou invalide
   */
  static async create(data) {
    // ───────────────────────────────────────────────────────────
    // 1. UTILISATEUR PAR DÉFAUT (Provisoire)
    // ───────────────────────────────────────────────────────────

    // TODO : Remplacer par l'utilisateur authentifié (req.user.id)
    // UUID issu du fichier de seeding (utilisateur de test)
    const SEEDER_USER_ID = "018d5c8e-5678-7001-9001-000000000001";

    // ───────────────────────────────────────────────────────────
    // 2. GÉNÉRATION DU SLUG
    // ───────────────────────────────────────────────────────────

    // Slug = version URL-friendly du titre
    // Ex: "Mon Titre Génial !" → "mon-titre-genial"
    // Respecte la contrainte NOT NULL de la BDD
    const slug = generateSlug(data.title);

    // ───────────────────────────────────────────────────────────
    // 3. REQUÊTE SQL INSERT
    // ───────────────────────────────────────────────────────────

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
    // RETURNING * → Retourne la ligne insérée avec tous ses champs
    // (y compris id_item, created_at générés automatiquement)

    // ───────────────────────────────────────────────────────────
    // 4. PRÉPARATION DES VALEURS
    // ───────────────────────────────────────────────────────────

    // Tableau correspondant aux $1, $2, $3...
    const values = [
      SEEDER_USER_ID, // $1
      data.contentType, // $2
      data.title, // $3
      slug, // $4
      data.content, // $5
      data.sourceAuthor || "N.C", // $6 (valeur par défaut si absent)
    ];

    // ───────────────────────────────────────────────────────────
    // 5. EXÉCUTION ET RETOUR
    // ───────────────────────────────────────────────────────────

    const { rows } = await db.query(query, values);

    // rows[0] contient la ligne insérée avec tous les champs
    // (y compris l'UUID et les timestamps générés par PostgreSQL)
    return new Item(rows[0]);
  }

  /**
   * ✏️ Met à jour une pépite existante (UPDATE)
   *
   * @static
   * @async
   * @method update
   * @param {string} id - ID de la pépite à modifier
   * @param {Object} data - Nouvelles données (partielles)
   * @param {string} [data.title] - Nouveau titre
   * @param {string} [data.contentType] - Nouveau type
   * @param {string} [data.content] - Nouveau contenu
   * @param {string} [data.sourceAuthor] - Nouvel auteur
   * @returns {Promise<Item|null>} Item modifié ou null si ID inexistant
   *
   * @description
   * - Permet une mise à jour PARTIELLE (seuls les champs fournis sont modifiés)
   * - Utilise COALESCE pour garder l'ancienne valeur si nouvelle = null
   * - Régénère le slug si le titre change
   * - updated_at est automatiquement mis à jour par PostgreSQL
   *
   * @example
   * // Modifier uniquement le titre
   * const updated = await Item.update('018d...', {
   *   title: "Nouveau titre"
   * });
   * // Les autres champs restent inchangés
   *
   * @throws {Error} Si l'ID est invalide ou si erreur BDD
   */
  static async update(id, data) {
    // ───────────────────────────────────────────────────────────
    // 1. RÉGÉNÉRATION DU SLUG
    // ───────────────────────────────────────────────────────────

    // Si le titre change, le slug doit changer aussi
    const slug = generateSlug(data.title);

    // ───────────────────────────────────────────────────────────
    // 2. REQUÊTE UPDATE AVEC COALESCE
    // ───────────────────────────────────────────────────────────

    const query = /*sql*/ `
      UPDATE items
      SET
        content_type = COALESCE($1, content_type),
        title = COALESCE($2, title),
        slug = COALESCE($3, slug),
        content = COALESCE($4, content),
        source_author = COALESCE($5, source_author)
      WHERE id_item = $6
      RETURNING *;
    `;

    // 💡 COALESCE(nouvelle_valeur, ancienne_valeur) :
    // - Si nouvelle_valeur n'est pas NULL → utilise nouvelle_valeur
    // - Si nouvelle_valeur est NULL → garde ancienne_valeur
    // → Permet une mise à jour partielle !

    // ───────────────────────────────────────────────────────────
    // 3. PRÉPARATION DES VALEURS
    // ───────────────────────────────────────────────────────────

    const values = [
      data.contentType, // $1 (peut être undefined)
      data.title, // $2
      slug, // $3
      data.content, // $4
      data.sourceAuthor || "N.C", // $5
      id, // $6 (WHERE clause)
    ];

    // ───────────────────────────────────────────────────────────
    // 4. EXÉCUTION ET GESTION DU RETOUR
    // ───────────────────────────────────────────────────────────

    const { rows } = await db.query(query, values);

    // Si aucune ligne n'a été modifiée (ID inexistant) → null
    // Sinon → retourne l'objet Item mis à jour
    return rows[0] ? new Item(rows[0]) : null;
  }

  /**
   * 🗑️ Supprime une pépite (DELETE)
   *
   * @static
   * @async
   * @method delete
   * @param {string} id - ID de la pépite à supprimer (UUIDv7)
   * @returns {Promise<boolean>} true si suppression réussie, false sinon
   *
   * @description
   * - Supprime définitivement une pépite de la base
   * - Retourne un booléen pour indiquer le succès/échec
   * - Ne lève pas d'erreur si l'ID n'existe pas (retourne false)
   *
   * @example
   * const success = await Item.delete('018d5c8e-1234-7001-8001-000000000001');
   * if (success) {
   *   console.log('Pépite supprimée');
   * } else {
   *   console.log('Pépite introuvable');
   * }
   *
   * @throws {Error} Si erreur de connexion à la base de données
   */
  static async delete(id) {
    // ───────────────────────────────────────────────────────────
    // 1. REQUÊTE DELETE
    // ───────────────────────────────────────────────────────────

    const query = /*sql*/ `
      DELETE FROM items
      WHERE id_item = $1;
    `;

    // ───────────────────────────────────────────────────────────
    // 2. EXÉCUTION
    // ───────────────────────────────────────────────────────────

    const result = await db.query(query, [id]);

    // ───────────────────────────────────────────────────────────
    // 3. LOG DE DÉBOGAGE
    // ───────────────────────────────────────────────────────────

    // ⚠️ À supprimer en production
    console.log(result);

    // ───────────────────────────────────────────────────────────
    // 4. VÉRIFICATION DU SUCCÈS
    // ───────────────────────────────────────────────────────────

    // result.rowCount = nombre de lignes affectées par la requête
    // - Si rowCount > 0 → Une ligne a été supprimée → true
    // - Si rowCount === 0 → Aucune ligne trouvée → false
    return result.rowCount > 0;
  }
}
