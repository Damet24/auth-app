export class SqlitePermissionRepository {
  constructor(db) {
    this.db = db;
  }

  async findByUserAndApp(userId, applicationId) {
    const rows = await this.db
      .prepare(
        `
      SELECT DISTINCT p.name
      FROM permissions p
      JOIN role_permissions rp ON rp.permission_id = p.id
      JOIN roles r ON r.id = rp.role_id
      JOIN user_roles ur ON ur.role_id = r.id
      WHERE ur.user_id = ?
      AND p.application_id = ?
    `
      )
      .all(userId, applicationId);

    return rows.map((p) => p.name);
  }
}
