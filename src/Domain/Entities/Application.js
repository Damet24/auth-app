export class Application {
  constructor({
    id,
    tenantId,
    name,
    clientId,
    clientSecretHash,
    active = true,
    redirectUrl = null,
    tokenStrategy = 'scoped',
    accessTokenTtl = 900,
    refreshTokenTtl = 604800,
    createdAt,
  }) {
    this.id = id;
    this.tenantId = tenantId;
    this.name = name;
    this.clientId = clientId;
    this.clientSecretHash = clientSecretHash;

    this.active = active;
    this.redirectUrl = redirectUrl;
    this.tokenStrategy = tokenStrategy;
    this.accessTokenTtl = accessTokenTtl;
    this.refreshTokenTtl = refreshTokenTtl;

    this.createdAt = createdAt || new Date();
  }

  isActive() {
    return this.active;
  }

  isScoped() {
    return this.tokenStrategy === 'scoped';
  }

  isGlobal() {
    return this.tokenStrategy === 'global';
  }
}
