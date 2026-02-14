export class SqliteSessionRepository {
  constructor(db) {
    this.db = db;
  }

  async create(session) {
    await this.db
      .prepare(
        `
          INSERT INTO sessions (id,
                                user_id,
                                application_id,
                                refresh_token_hash,
                                token_version,
                                expires_at,
                                revoked)
          VALUES (?, ?, ?, ?, ?, ?, ?)
      `
      )
      .run(
        session.id,
        session.userId,
        session.applicationId,
        session.refreshTokenHash,
        session.tokenVersion,
        session.expiresAt.toISOString(),
        session.revoked ? 1 : 0
      );
  }

  async findById(id) {
    const result = this.db
      .prepare('SELECT * FROM sessions WHERE id = ?')
      .get(id);
    console.log(result);
    return result;
  }

  async revoke(id) {
    await this.db.run('UPDATE sessions SET revoked = 1 WHERE id = ?', [id]);
  }
}
