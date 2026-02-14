import { v4 as uuidv4 } from 'uuid';
import { Role } from '../../Domain/Entities/Role.js';

export class SqliteRoleRepository {
  constructor(db) {
    this.db = db;
  }

  mapRow(row) {
    if (!row) return null;

    return new Role({
      id: row.id,
      applicationId: row.applicationId,
      name: row.name,
      active: row.active === 1,
      createdAt: new Date(row.createdAt),
    });
  }

  async findById(id) {
    const row = await this.db
      .prepare(
        `
      SELECT id,
             application_id as applicationId,
             name,
             active,
             created_at as createdAt
      FROM roles
      WHERE id = ?
    `
      )
      .get(id);

    return this.mapRow(row);
  }

  async findByApplication(applicationId) {
    const rows = await this.db
      .prepare(
        `
      SELECT id,
             application_id as applicationId,
             name,
             active,
             created_at as createdAt
      FROM roles
      WHERE application_id = ?
    `
      )
      .all(applicationId);

    return rows.map((r) => this.mapRow(r));
  }

  async exists(applicationId, name) {
    const row = await this.db
      .prepare(
        `
      SELECT 1
      FROM roles
      WHERE application_id = ? AND name = ?
    `
      )
      .get(applicationId, name);

    return !!row;
  }

  async create({ applicationId, name }) {
    const id = uuidv4();

    await this.db
      .prepare(
        `
      INSERT INTO roles (id, application_id, name, active)
      VALUES (?, ?, ?, 1)
    `
      )
      .run(id, applicationId, name);

    return this.findById(id);
  }

  async update(id, { name, active }) {
    await this.db
      .prepare(
        `
      UPDATE roles
      SET name = COALESCE(?, name),
          active = COALESCE(?, active)
      WHERE id = ?
    `
      )
      .run(name ?? null, active !== undefined ? (active ? 1 : 0) : null, id);

    return this.findById(id);
  }
}
