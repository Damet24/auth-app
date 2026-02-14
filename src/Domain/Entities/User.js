export class User {
    constructor({
                    id,
                    tenantId,
                    email,
                    emailVerified = false,
                    active = true,
                    isGlobalAdmin,
                    tokenVersion,
                    createdAt,
                }) {
        this.id = id;
        this.tenantId = tenantId;
        this.email = email;
        this.emailVerified = emailVerified;
        this.active = active;
        this.isGlobalAdmin = isGlobalAdmin;
        this.tokenVersion = tokenVersion;
        this.createdAt = createdAt || new Date();
    }

    verifyEmail() {
        this.emailVerified = true;
    }

    deactivate() {
        this.active = false;
    }
}
