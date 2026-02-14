export class Permission {
  constructor({ id, applicationId, name }) {
    this.id = id;
    this.applicationId = applicationId;
    this.name = name;
  }

  get resource() {
    return this.name.split(':')[1] ?? null;
  }

  get action() {
    return this.name.split(':')[2] ?? null;
  }
}
