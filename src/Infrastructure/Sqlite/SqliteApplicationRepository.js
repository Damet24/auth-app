import { v4 as uuidv4 } from 'uuid';
import { Application } from '../../Domain/Entities/Application.js';

export class SqliteApplicationRepository {
  constructor(db) {
    this.db = db;
  }

  mapRow(row) {
    if (!row) return null;

    return new Application({
      id: row.id,
      tenantId: row.tenantId,
      name: row.name,
      clientId: row.clientId,
      active: row.active === 1,
      redirectUrl: row.redirectUrl,
      tokenStrategy: row.tokenStrategy,
      accessTokenTtl: row.accessTokenTtl,
      refreshTokenTtl: row.refreshTokenTtl,
      createdAt: new Date(row.createdAt),
    });
  }

  baseSelect() {
    return `
      SELECT id,
             tenant_id as tenantId,
             name,
             client_id as clientId,
             active,
             redirect_url as redirectUrl,
             token_strategy as tokenStrategy,
             access_token_ttl as accessTokenTtl,
             refresh_token_ttl as refreshTokenTtl,
             created_at as createdAt
      FROM applications
    `;
  }

  async findById(id) {
    const row = await this.db
      .prepare(`${this.baseSelect()} WHERE id = ?`)
      .get(id);

    return this.mapRow(row);
  }

  async findByClientId(clientId) {
    const row = await this.db
      .prepare(`${this.baseSelect()} WHERE client_id = ?`)
      .get(clientId);

    return this.mapRow(row);
  }

  async findByTenant(tenantId) {
    const rows = await this.db
      .prepare(`${this.baseSelect()} WHERE tenant_id = ?`)
      .all(tenantId);

    return rows.map((r) => this.mapRow(r));
  }

  async create(data) {
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    await this.db
      .prepare(
        `
      INSERT INTO applications (
        id,
        tenant_id,
        name,
        client_id,
        active,
        client_secret_hash,
        redirect_url,
        token_strategy,
        access_token_ttl,
        refresh_token_ttl,
        created_at
      )
      VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)
    `
      )
      .run(
        id,
        data.tenantId,
        data.name,
        data.clientId,
        data.clientSecretHash,
        data.redirectUrl ?? null,
        data.tokenStrategy ?? 'scoped',
        data.accessTokenTtl ?? 900,
        data.refreshTokenTtl ?? 604800,
        createdAt
      );

    return this.findById(id);
  }

  async update(id, data) {
    await this.db
      .prepare(
        `
      UPDATE applications
      SET name = COALESCE(?, name),
          redirect_url = COALESCE(?, redirect_url),
          token_strategy = COALESCE(?, token_strategy),
          access_token_ttl = COALESCE(?, access_token_ttl),
          refresh_token_ttl = COALESCE(?, refresh_token_ttl),
          active = COALESCE(?, active)
      WHERE id = ?
    `
      )
      .run(
        data.name ?? null,
        data.redirectUrl ?? null,
        data.tokenStrategy ?? null,
        data.accessTokenTtl ?? null,
        data.refreshTokenTtl ?? null,
        data.active !== undefined ? (data.active ? 1 : 0) : null,
        id
      );

    return this.findById(id);
  }
}
