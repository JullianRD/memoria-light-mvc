

export class ItemEntity {
  constructor(row) {
    this.id = row.id_item ?? row.id;
    this.userId = row.user_id;
    this.contentType = row.content_type ?? row.type;
    this.title = row.title;
    this.slug = row.slug;
    this.content = row.content;
    this.sourceAuthor = row.source_author ?? row.author;
    this.thumbnailUrl = row.thumbnail_url ?? row.image_url ?? row.source_url;
    this.metadata = row.metadata;
    this.tags = row.tags ?? [];
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
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
