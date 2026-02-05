

export class ItemTag {
  constructor(row) {
    this.itemId = row.item_id;
    this.tagId = row.tag_id;
    this.createdAt = row.created_at;
  }
      /**
   * Crée une entité depuis une ligne PostgreSQL
   */
  static fromDatabase(row) {
    return row ? new ItemEntity(row) : null;
  }

  /**
   * Crée une liste d'entités depuis des lignes PostgreSQL
   */
  static fromDatabaseList(rows) {
    return rows.map((row) => new ItemEntity(row));
  }
}