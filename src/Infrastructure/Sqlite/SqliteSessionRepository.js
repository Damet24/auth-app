export class SqliteSessionRepository {
    constructor(db) {
        this.db = db;
    }

    async create(session) {
        await this.db.run(`
            INSERT INTO sessions (id,
                                  user_id,
                                  application_id,
                                  refresh_token_hash,
                                  token_version,
                                  expires_at,
                                  revoked)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            session.id,
            session.userId,
            session.applicationId,
            session.refreshTokenHash,
            session.tokenVersion,
            session.expiresAt,
            session.revoked ? 1 : 0
        ]);
    }

    async findById(id) {
        return this.db.get(
            "SELECT * FROM sessions WHERE id = ?",
            [id]
        );
    }

    async revoke(id) {
        await this.db.run(
            "UPDATE sessions SET revoked = 1 WHERE id = ?",
            [id]
        );
    }
}
