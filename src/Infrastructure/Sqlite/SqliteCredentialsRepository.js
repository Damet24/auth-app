import { v4 as uuidv4 } from 'uuid';
import { Credential } from '../../Domain/Entities/Credential.js';

export class SqliteCredentialRepository {
    constructor(db) {
        this.db = db;
    }

    mapRow(row) {
        if (!row) return null;

        return new Credential({
            id: row.id,
            userId: row.userId,
            provider: row.provider,
            passwordHash: row.passwordHash,
            createdAt: new Date(row.createdAt)
        });
    }

    baseSelect() {
        return `
      SELECT id,
             user_id as userId,
             provider,
             password_hash as passwordHash,
             created_at as createdAt
      FROM user_credentials
    `;
    }

    async findLocalByUserId(userId) {
        const row = await this.db
            .prepare(`${this.baseSelect()} WHERE user_id = ? AND provider = 'local'`)
            .get(userId);

        return this.mapRow(row);
    }

    async createLocal(userId, passwordHash) {
        const id = uuidv4();
        const createdAt = new Date().toISOString();

        await this.db.prepare(`
      INSERT INTO user_credentials (
        id,
        user_id,
        provider,
        password_hash,
        created_at
      )
      VALUES (?, ?, 'local', ?, ?)
    `).run(id, userId, passwordHash, createdAt);

        return this.findLocalByUserId(userId);
    }

    async updatePassword(userId, passwordHash) {
        await this.db.prepare(`
      UPDATE user_credentials
      SET password_hash = ?
      WHERE user_id = ? AND provider = 'local'
    `).run(passwordHash, userId);
    }
}
