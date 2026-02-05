

export class ShareEntity {
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
   * Crée une entité depuis une ligne PostgreSQL
   */
  static fromDatabase(row) {
    return row ? new ShareEntity(row) : null;
  }

  /**
   * Crée une liste d'entités depuis des lignes PostgreSQL
   */
  static fromDatabaseList(rows) {
    return rows.map((row) => new ShareEntity(row));
  }
}