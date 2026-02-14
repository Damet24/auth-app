import { v4 as uuidv4 } from 'uuid';
import { Tenant } from '../../Domain/Entities/Tenant.js';

export class SqliteTenantRepository {
  constructor(db) {
    this.db = db;
  }

  mapRowToTenant(row) {
    if (!row) return null;

    return new Tenant({
      id: row.id,
      name: row.name,
      active: row.active === 1,
      createdAt: new Date(row.createdAt),
    });
  }

  baseSelect() {
    return `
      SELECT id,
             name,
             active,
             created_at as createdAt
      FROM tenants
    `;
  }

  async findById(id) {
    const row = await this.db
      .prepare(`${this.baseSelect()} WHERE id = ?`)
      .get(id);

    return this.mapRowToTenant(row);
  }

  async findByName(name) {
    const row = await this.db
      .prepare(`${this.baseSelect()} WHERE name = ?`)
      .get(name);

    return this.mapRowToTenant(row);
  }

  async findAll() {
    const rows = await this.db.prepare(this.baseSelect()).all();

    return rows.map((r) => this.mapRowToTenant(r));
  }

  async existsByName(name) {
    const row = await this.db
      .prepare(`SELECT 1 FROM tenants WHERE name = ?`)
      .get(name);

    return !!row;
  }

  async create({ name }) {
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    await this.db
      .prepare(
        `
        INSERT INTO tenants (id, name, active, created_at)
        VALUES (?, ?, 1, ?)
      `
      )
      .run(id, name, createdAt);

    return this.findById(id);
  }

  async update(id, { name }) {
    await this.db
      .prepare(
        `
        UPDATE tenants
        SET name = COALESCE(?, name)
        WHERE id = ?
      `
      )
      .run(name ?? null, id);

    return this.findById(id);
  }

  async deactivate(id) {
    await this.db.prepare(`UPDATE tenants SET active = 0 WHERE id = ?`).run(id);
  }
}
