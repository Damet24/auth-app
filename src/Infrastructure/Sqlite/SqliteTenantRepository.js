export class SqliteTenantRepository {
    constructor(db) {
        this.db = db;
    }

    async findById(id) {
        return this.db.get(
            `SELECT id, name, active, created_at as createdAt
             FROM tenants
             WHERE id = ?`,
            [id]
        );
    }
}
