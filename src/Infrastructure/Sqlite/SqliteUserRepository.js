import { User } from '../../Domain/Entities/User.js';
import { v4 as uuidv4 } from 'uuid';

export class SqliteUserRepository {
  constructor(db) {
    this.db = db;
  }

  mapRowToUser(row) {
    if (!row) return null;

    return new User({
      id: row.id,
      tenantId: row.tenantId,
      email: row.email,
      emailVerified: row.emailVerified === 1,
      active: row.active === 1,
      isGlobalAdmin: row.isGlobalAdmin === 1,
      tokenVersion: row.tokenVersion,
      createdAt: new Date(row.createdAt),
    });
  }

  baseSelect() {
    return `
      SELECT id,
             tenant_id       as tenantId,
             email,
             email_verified  as emailVerified,
             active,
             is_global_admin as isGlobalAdmin,
             token_version   as tokenVersion,
             created_at      as createdAt
      FROM users
    `;
  }

  async findById(id) {
    const row = await this.db
      .prepare(`${this.baseSelect()} WHERE id = ?`)
      .get(id);

    return this.mapRowToUser(row);
  }

  async findByEmail(tenantId, email) {
    const row = await this.db
      .prepare(`${this.baseSelect()} WHERE tenant_id = ? AND email = ?`)
      .get(tenantId, email);

    return this.mapRowToUser(row);
  }

  async findGlobalByEmail(email) {
    const row = await this.db
      .prepare(`${this.baseSelect()} WHERE is_global_admin = 1 AND email = ?`)
      .get(email);

    return this.mapRowToUser(row);
  }

  async findAll() {
    const rows = await this.db.prepare(this.baseSelect()).all();

    return rows.map((r) => this.mapRowToUser(r));
  }

  async findByTenant(tenantId) {
    const rows = await this.db
      .prepare(`${this.baseSelect()} WHERE tenant_id = ?`)
      .all(tenantId);

    return rows.map((r) => this.mapRowToUser(r));
  }

  async existsByEmail(tenantId, email) {
    const row = await this.db
      .prepare(`SELECT 1 FROM users WHERE tenant_id = ? AND email = ?`)
      .get(tenantId, email);

    return !!row;
  }

  async create({
    tenantId,
    email,
    emailVerified = false,
    active = true,
    tokenVersion = 1,
    isGlobalAdmin = false,
  }) {
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    await this.db
      .prepare(
        `
        INSERT INTO users (
          id,
          tenant_id,
          email,
          email_verified,
          active,
          is_global_admin,
          token_version,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
      .run(
        id,
        tenantId,
        email,
        emailVerified ? 1 : 0,
        active ? 1 : 0,
        isGlobalAdmin ? 1 : 0,
        tokenVersion,
        createdAt
      );

    return this.findById(id);
  }

  async update(id, { emailVerified, active }) {
    await this.db
      .prepare(
        `
        UPDATE users
        SET email_verified = COALESCE(?, email_verified),
            active = COALESCE(?, active)
        WHERE id = ?
      `
      )
      .run(
        emailVerified !== undefined ? (emailVerified ? 1 : 0) : null,
        active !== undefined ? (active ? 1 : 0) : null,
        id
      );

    return this.findById(id);
  }

  async deactivate(id) {
    await this.db.prepare(`UPDATE users SET active = 0 WHERE id = ?`).run(id);
  }

  async incrementTokenVersion(id) {
    await this.db
      .prepare(
        `UPDATE users SET token_version = token_version + 1 WHERE id = ?`
      )
      .run(id);
  }
}
