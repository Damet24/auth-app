import {
    roleRepository,
    applicationRepository
} from '../../Domain/Repositories/index.js';

import {
    ForbiddenError,
    NotFoundError,
    ConflictError
} from '../../Domain/Errors/AppError.js';

export class RoleService {

    async listRoles(currentUser, applicationId) {
        const app = await applicationRepository.findById(applicationId);
        if (!app) throw new NotFoundError("Application not found");

        if (!currentUser.is_global_admin &&
            app.tenantId !== currentUser.tenant_id) {
            throw new ForbiddenError("Access denied");
        }

        return roleRepository.findByApplication(applicationId);
    }

    async createRole(currentUser, applicationId, { name }) {
        const app = await applicationRepository.findById(applicationId);
        if (!app) throw new NotFoundError("Application not found");

        if (!currentUser.is_global_admin &&
            app.tenantId !== currentUser.tenant_id) {
            throw new ForbiddenError("Access denied");
        }

        const exists = await roleRepository.exists(applicationId, name);
        if (exists) throw new ConflictError("Roles already exists");

        return roleRepository.create({ applicationId, name });
    }

    async updateRole(currentUser, roleId, data) {
        const role = await roleRepository.findById(roleId);
        if (!role) throw new NotFoundError("Roles not found");

        const app = await applicationRepository.findById(role.applicationId);

        if (!currentUser.is_global_admin &&
            app.tenantId !== currentUser.tenant_id) {
            throw new ForbiddenError("Access denied");
        }

        return roleRepository.update(roleId, data);
    }
}
