export class SqliteApplicationRepository {
  constructor(db) {
    this.db = db;
  }

  async findByClientId(clientId) {
    return this.db
      .prepare(
        `SELECT id,
                    tenant_id          as tenantId,
                    name,
                    client_id          as clientId,
                    active,
                    client_secret_hash as clientSecretHash,
                    redirect_url       as redirectUrl,
                    token_strategy     as tokenStrategy,
                    access_token_ttl   as accessTokenTtl,
                    refresh_token_ttl  as refreshTokenTtl,
                    created_at         as createdAt
             FROM applications
             WHERE client_id = ?;`
      )
      .get(clientId);
  }

  async findById(id) {
    return this.db
      .prepare(
        `SELECT id,
                    tenant_id          as tenantId,
                    name,
                    client_id          as clientId,
                    active,
                    client_secret_hash as clientSecretHash,
                    redirect_url       as redirectUrl,
                    token_strategy     as tokenStrategy,
                    access_token_ttl   as accessTokenTtl,
                    refresh_token_ttl  as refreshTokenTtl,
                    created_at         as createdAt
             FROM applications
             WHERE id = ?`
      )
      .get(id);
  }
}
