export class SqliteRolePermissionRepository {
  constructor(db) {
    this.db = db;
  }

  async addPermission(roleId, permissionId) {
    await this.db
      .prepare(
        `
      INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
      VALUES (?, ?)
    `
      )
      .run(roleId, permissionId);
  }

  async removePermission(roleId, permissionId) {
    await this.db
      .prepare(
        `
      DELETE FROM role_permissions
      WHERE role_id = ? AND permission_id = ?
    `
      )
      .run(roleId, permissionId);
  }

  async findPermissionsByRole(roleId) {
    return this.db
      .prepare(
        `
      SELECT p.id,
             p.application_id as applicationId,
             p.name
      FROM permissions p
      INNER JOIN role_permissions rp
        ON rp.permission_id = p.id
      WHERE rp.role_id = ?
    `
      )
      .all(roleId);
  }
}
