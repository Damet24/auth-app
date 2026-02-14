export class Credential {
  constructor({
                id,
                userId,
                provider,
                passwordHash,
                createdAt
              }) {
    this.id = id;
    this.userId = userId;
    this.provider = provider;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt || new Date();
  }

  isLocal() {
    return this.provider === 'local';
  }
}
