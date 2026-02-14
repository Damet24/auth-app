import {User} from "../../Domain/Entities/User.js"

export class SqliteUserRepository {
    constructor(db) {
        this.db = db;
    }

    async findByEmail(tenantId, email) {
        const result = await this.db.get(
            `SELECT id,
                    tenant_id       as tenantId,
                    email,
                    email_verified  as emailVerified,
                    active,
                    is_global_admin as isGlobalAdmin,
                    token_version   as tokenVersion,
                    created_at      as createdAt
             FROM users
             WHERE tenant_id = ?
               AND email = ?`,
            [tenantId, email]
        );
        return new User({
            id: result.id,
            tenantId: result.tenantId,
            email: result.email,
            emailVerified: result.emailVerified === 1,
            active: result.active === 1,
            isGlobalAdmin: result.isGlobalAdmin === 1,
            tokenVersion: result.tokenVersion,
            createdAt: new Date(result.createdAt)
        });
    }

    async findById(id) {
        const result = await this.db.get(
            `SELECT id,
                    tenant_id      as tenantId,
                    email,
                    email_verified as emailVerified,
                    active,
                    is_global_admin as isGlobalAdmin,
                    token_version  as tokenVersion,
                    created_at     as createdAt
             FROM users
             WHERE id = ?`,
            [id]
        );
        return new User({
            id: result.id,
            tenantId: result.tenantId,
            email: result.email,
            emailVerified: result.emailVerified === 1,
            active: result.active === 1,
            isGlobalAdmin: result.isGlobalAdmin === 1,
            tokenVersion: result.tokenVersion,
            createdAt: new Date(result.createdAt)
        });
    }

    async create({tenantId, email, emailVerified, active, tokenVersion, createdAt}) {
        await this.db.prepare(`insert into users
                                   (tenant_id, email, email_verified, active, token_version, created_at)
                               values (?, ?, ?, ?, ?, ?);`)
            .run(tenantId, email, emailVerified, active, tokenVersion, createdAt)
    }

    async incrementTokenVersion(id) {
        await this.db.run(
            "UPDATE users SET token_version = token_version + 1 WHERE id = ?",
            [id]
        );
    }

    async findAll() {
        const result = await this.db.all(`SELECT id,
                                                 tenant_id       as tenantId,
                                                 email,
                                                 email_verified  as emailVerified,
                                                 active,
                                                 is_global_admin as isGlobalAdmin,
                                                 token_version   as tokenVersion,
                                                 created_at      as createdAt
                                          FROM users`)
        return result.map(item => new User({
            id: item.id,
            tenantId: item.tenantId,
            email: item.email,
            emailVerified: item.emailVerified === 1,
            active: item.active === 1,
            isGlobalAdmin: item.isGlobalAdmin === 1,
            tokenVersion: item.tokenVersion,
            createdAt: new Date(item.createdAt)
        }));
    }

    async findByTenant(tenantId) {
        const result = await this.db.all(`SELECT id,
                                                 tenant_id       as tenantId,
                                                 email,
                                                 email_verified  as emailVerified,
                                                 active,
                                                 is_global_admin as isGlobalAdmin,
                                                 token_version   as tokenVersion,
                                                 created_at      as createdAt
                                          FROM users
                                          WHERE tenant_id = ?`, [tenantId])
        return result.map(item => new User({
            id: item.id,
            tenantId: item.tenantId,
            email: item.email,
            emailVerified: item.emailVerified === 1,
            active: item.active === 1,
            isGlobalAdmin: item.isGlobalAdmin === 1,
            tokenVersion: item.tokenVersion,
            createdAt: new Date(item.createdAt)
        }));
    }
}
