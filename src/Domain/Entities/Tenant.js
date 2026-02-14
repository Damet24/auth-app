class Tenant {
  constructor({ id, name, active = true, createdAt }) {
    this.id = id;
    this.name = name;
    this.active = active;
    this.createdAt = createdAt || new Date();
  }

  deactivate() {
    this.active = false;
  }
}
