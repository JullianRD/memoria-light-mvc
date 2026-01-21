import db from '../config/database.js';

export class Tag {
    constructor(row) {
        // Mapping JS (camelCase) vers SQL (snake_case)
        this.id = row.id_tag;
        this.tagName = row.tag_name
        this.userId = row.user_id
        this.createdAt = row.created_at;
        this.updatedAt = row.updated_at;
    }

    static async findAll() {
        const query = "SELECT * FROM tags ORDER BY created_at DESC"
        const { rows } = await db.query(query)
        return rows.map((row) => new Tag(row));
    }
        static async create(data) {
        // On simule un utilisateur / Ton UUID issu de tes seeders 
        const SEEDER_USER_ID = "018d5c8e-5678-7001-9001-000000000001";

        const query = /*sql*/`
        INSERT INTO tags (user_id, tag_name)
        VALUES ($1, $2)
        RETURNING *;
        `;

        const values = [
            SEEDER_USER_ID,
            data.TagName,
        ];

        const {rows} = await db.query(query, values);
        return new Item(rows[0])
    }
}