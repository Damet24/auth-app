export class SqliteTenantRepository {
  constructor(db) {
    this.db = db;
  }

  async findById(id) {
    return this.db
      .prepare(
        `SELECT id, name, active, created_at as createdAt
             FROM tenants
             WHERE id = ?`
      )
      .get(id);
  }
}
