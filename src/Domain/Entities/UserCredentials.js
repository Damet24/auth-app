class UserCredential {
  constructor({ id, userId, provider, passwordHash, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.provider = provider; // "local", "google"
    this.passwordHash = passwordHash;
    this.createdAt = createdAt || new Date();
  }
}
