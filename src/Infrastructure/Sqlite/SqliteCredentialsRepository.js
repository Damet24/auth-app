export class SqliteCredentialsRepository {
    constructor(db) {
        this.db = db;
    }

    async findLocalByUserId(userId) {
        return this.db.get(
            `SELECT id,
                    user_id       as userId,
                    provider,
                    password_hash as passwordHash,
                    created_at    as createdAt
             FROM user_credentials
             WHERE user_id = ?
               AND provider = 'local'`,
            [userId]
        );
    }
}
