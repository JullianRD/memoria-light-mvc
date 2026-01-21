import db from '../config/database.js';

export class Item {
    constructor(row) {
        // Mapping JS (camelCase) vers SQL (snake_case)
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

    static async create(data) {
        // On simule un utilisateur / Ton UUID issu de tes seeders 
        const SEEDER_ITEM_ID = "018d5c8e-5678-7001-9001-018d5c8e-8001-7001-b001-000000000001";

        // Génération du slug basique pour respecter la contrainte NOT NULL 
        const slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g,"")
        .replace(/[\s_-]+/g,"-")
        .replace(/^-+|-+$/g,"");

        const query = /*sql*/`
        INSERT INTO items (user_id, content_type, title, slug, content, source_author)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `;

        const values = [
            SEEDER_USER_ID,
            data.contentType,
            data.title,
            slug,
            data.content,
            data.sourceAuthor || "N.C",
        ];

        const {rows} = await db.query(query, values);
        return new Item(rows[0])
    }
}

// export default Item

