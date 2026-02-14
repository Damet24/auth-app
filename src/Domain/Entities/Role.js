export class Role {
  constructor({
                id,
                applicationId,
                name,
                active = true,
                createdAt
              }) {
    this.id = id;
    this.applicationId = applicationId;
    this.name = name;
    this.active = active;
    this.createdAt = createdAt || new Date();
  }
}
