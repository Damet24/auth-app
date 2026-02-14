class Session {
  constructor({
    id,
    userId,
    applicationId,
    refreshTokenHash,
    expiresAt,
    revoked = false,
    createdAt,
  }) {
    this.id = id;
    this.userId = userId;
    this.applicationId = applicationId;
    this.refreshTokenHash = refreshTokenHash;
    this.expiresAt = expiresAt;
    this.revoked = revoked;
    this.createdAt = createdAt || new Date();
  }

  revoke() {
    this.revoked = true;
  }

  isExpired() {
    return new Date() > this.expiresAt;
  }
}
