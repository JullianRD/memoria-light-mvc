/**
 * @fileoverview Modèle pour la table pivot item_tags
 * Gère la relation Many-to-Many entre Items et Tags
 */

import db from "../config/database.js";

export class ItemTag {
  constructor(row) {
    this.itemId = row.item_id;
    this.tagId = row.tag_id;
    this.createdAt = row.created_at;
  }

  /**
   * Associe un tag à un item
   * @param {string} itemId - UUID de l'item
   * @param {string} tagId - UUID du tag
   * @returns {Promise<ItemTag>}
   */
  static async addTagToItem(itemId, tagId) {
    const query = /*sql*/ `
      INSERT INTO item_tags (item_id, tag_id)
      VALUES ($1, $2)
      ON CONFLICT (item_id, tag_id) DO NOTHING
      RETURNING *;
    `;

    const { rows } = await db.query(query, [itemId, tagId]);
    return rows[0] ? new ItemTag(rows[0]) : null;
  }

  /**
   * Retire un tag d'un item
   * @param {string} itemId - UUID de l'item
   * @param {string} tagId - UUID du tag
   * @returns {Promise<boolean>}
   */
  static async removeTagFromItem(itemId, tagId) {
    const query = /*sql*/ `
      DELETE FROM item_tags
      WHERE item_id = $1 AND tag_id = $2;
    `;

    const result = await db.query(query, [itemId, tagId]);
    return result.rowCount > 0;
  }

  /**
   * Récupère tous les tags d'un item
   * @param {string} itemId - UUID de l'item
   * @returns {Promise<Array>}
   */
  static async getTagsForItem(itemId) {
    const query = /*sql*/ `
      SELECT t.*
      FROM tags t
      INNER JOIN item_tags it ON t.id_tag = it.tag_id
      WHERE it.item_id = $1;
    `;

    const { rows } = await db.query(query, [itemId]);
    return rows;
  }

  /**
   * Récupère tous les items ayant un tag donné
   * @param {string} tagId - UUID du tag
   * @returns {Promise<Array>}
   */
  static async getItemsForTag(tagId) {
    const query = /*sql*/ `
      SELECT i.*
      FROM items i
      INNER JOIN item_tags it ON i.id_item = it.item_id
      WHERE it.tag_id = $1;
    `;

    const { rows } = await db.query(query, [tagId]);
    return rows;
  }

  /**
   * Remplace tous les tags d'un item
   * @param {string} itemId - UUID de l'item
   * @param {string[]} tagIds - Tableau d'UUIDs de tags
   * @returns {Promise<void>}
   */
  static async setTagsForItem(itemId, tagIds) {
    // Transaction pour garantir l'intégrité
    await db.query("BEGIN");

    try {
      // 1. Supprimer tous les anciens tags
      await db.query(
        /*sql*/ `
        DELETE FROM item_tags WHERE item_id = $1;
      `,
        [itemId],
      );

      // 2. Ajouter les nouveaux tags
      if (tagIds.length > 0) {
        const values = tagIds
          .map((tagId, index) => `($1, $${index + 2})`)
          .join(", ");

        await db.query(
          /*sql*/ `
          INSERT INTO item_tags (item_id, tag_id)
          VALUES ${values};
        `,
          [itemId, ...tagIds],
        );
      }

      await db.query("COMMIT");
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  }
}
