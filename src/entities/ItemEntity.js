

export class ItemEntity {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.type = data.type;
    this.title = data.title;
    this.content = data.content;
    this.author = data.author;
    this.source_url = data.source_url;
    this.image_url = data.image_url;
    this.slug = data.slug;
    this.is_public = data.is_public;
    this.view_count = data.view_count;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
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