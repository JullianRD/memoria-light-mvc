

export class TagEntity {
  constructor(row) {
    // Mapping SQL (snake_case) vers JS (camelCase)
    this.id = row.id_tag;
    this.userId = row.user_id;
    this.tagName = row.tag_name
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }
      /**
   * Crée une entité depuis une ligne PostgreSQL
   */
  static fromDatabase(row) {
    return row ? new TagEntity(row) : null;
  }

  /**
   * Crée une liste d'entités depuis des lignes PostgreSQL
   */
  static fromDatabaseList(rows) {
    return rows.map((row) => new TagEntity(row));
  }
}