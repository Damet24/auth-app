class Application {
  constructor({ id, tenantId, name, clientId, clientSecretHash, createdAt }) {
    this.id = id;
    this.tenantId = tenantId;
    this.name = name;
    this.clientId = clientId;
    this.clientSecretHash = clientSecretHash;
    this.createdAt = createdAt || new Date();
  }
}
