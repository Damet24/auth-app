export class SqliteUserRoleRepository {
  constructor(db) {
    this.db = db;
  }

  async addRole(userId, roleId) {
    await this.db
      .prepare(
        `
      INSERT OR IGNORE INTO user_roles (user_id, role_id)
      VALUES (?, ?)
    `
      )
      .run(userId, roleId);
  }

  async removeRole(userId, roleId) {
    await this.db
      .prepare(
        `
      DELETE FROM user_roles
      WHERE user_id = ? AND role_id = ?
    `
      )
      .run(userId, roleId);
  }

  async findRolesByUser(userId) {
    return this.db
      .prepare(
        `
      SELECT r.id,
             r.application_id as applicationId,
             r.name,
             r.active,
             r.created_at as createdAt
      FROM roles r
      INNER JOIN user_roles ur
        ON ur.role_id = r.id
      WHERE ur.user_id = ?
    `
      )
      .all(userId);
  }
}
