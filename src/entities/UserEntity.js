import { ItemEntity } from "./ItemEntity";


export class UserEntity {
  constructor(row) {
    // Mapping SQL (snake_case) vers JS (camelCase)
    this.id = row.id_user;
    this.email = row.email
    this.passwordHash = row.password_hash
    this.pseudo = row.pseudo
    this.roleName = row.role_name
    this.auth_provider = row.auth_provider
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }
  // Crée une entité depuis une ligne PostgreSQL
  static fromDatabase(row) {
    return row ? new UserEntity(row) : null;
  }

  // Crée une liste d'entités depuis des lignes PostGreSQL
  static fromDatabaseList(rows) {
    return rows.map((row) => UserEntity(row));
  }
}