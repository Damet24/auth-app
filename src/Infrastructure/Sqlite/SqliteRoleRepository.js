export class SqliteRoleRepository {
    constructor(db) {
        this.db = db;
    }

    async findByUserAndApp(userId, applicationId) {
        const rows = await this.db.all(`
            SELECT r.name
            FROM roles r
                     JOIN user_roles ur ON ur.role_id = r.id
            WHERE ur.user_id = ?
              AND r.application_id = ?
        `, [userId, applicationId]);

        return rows.map(r => r.name);
    }
}
