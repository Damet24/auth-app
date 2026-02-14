class Role {
  constructor({ id, applicationId, name, createdAt }) {
    this.id = id;
    this.applicationId = applicationId;
    this.name = name;
    this.createdAt = createdAt || new Date();
  }
}
