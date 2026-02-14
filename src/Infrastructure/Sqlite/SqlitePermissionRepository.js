import { v4 as uuidv4 } from 'uuid';
import { Permission } from '../../Domain/Entities/Permission.js';

export class SqlitePermissionRepository {
  constructor(db) {
    this.db = db;
  }

  mapRow(row) {
    if (!row) return null;

    return new Permission({
      id: row.id,
      applicationId: row.applicationId,
      name: row.name
    });
  }

  async findByApplication(applicationId) {
    const rows = await this.db.prepare(`
      SELECT id,
             application_id as applicationId,
             name
      FROM permissions
      WHERE application_id = ?
    `).all(applicationId);

    return rows.map(r => this.mapRow(r));
  }

  async findById(id) {
    const row = await this.db.prepare(`
      SELECT id,
             application_id as applicationId,
             name
      FROM permissions
      WHERE id = ?
    `).get(id);

    return this.mapRow(row);
  }

  async exists(applicationId, name) {
    const row = await this.db.prepare(`
      SELECT 1
      FROM permissions
      WHERE application_id = ? AND name = ?
    `).get(applicationId, name);

    return !!row;
  }

  async create({ applicationId, name }) {
    const id = uuidv4();

    await this.db.prepare(`
      INSERT INTO permissions (id, application_id, name)
      VALUES (?, ?, ?)
    `).run(id, applicationId, name);

    return this.findById(id);
  }
}
