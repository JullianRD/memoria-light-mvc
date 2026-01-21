import db from '../config/database.js';

export class Item {
    constructor(row) {
        // Mapping SQL (snake_case) vers JS (camelCase)
        this.id = row.id_item;
        this.userId = row.user_id;
        this.contentType = row.content_type;
        this.title = row.title;
        this.slug = row.slug;
        this.content = row.content;
        this.sourceAuthor = row.source_author;
        this.thumbnailUrl = row.thumbnail_url;
        this.metadata = row.metadata;
        this.createdAt = row.created_at;
        this.updatedAt = row.updated_at;
    }

    static async findAll() {
        // Je prépare ma requête
        const query = "SELECT * FROM items ORDER BY created_at DESC;";
        const { rows } = await db.query(query)
        return rows.map((row) => new Item(row));
    }
}

// export default Item

