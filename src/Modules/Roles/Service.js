import {
    roleRepository,
    applicationRepository, permissionRepository, rolePermissionRepository
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
            app.tenantId !== currentUser.tenantId) {
            throw new ForbiddenError("Access denied");
        }

        return roleRepository.findByApplication(applicationId);
    }

    async createRole(currentUser, applicationId, { name }) {
        const app = await applicationRepository.findById(applicationId);
        if (!app) throw new NotFoundError("Application not found");

        if (!currentUser.is_global_admin &&
            app.tenantId !== currentUser.tenantId) {
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
            app.tenantId !== currentUser.tenantId) {
            throw new ForbiddenError("Access denied");
        }

        return roleRepository.update(roleId, data);
    }

    async assignPermission(currentUser, roleId, permissionId) {
        const role = await roleRepository.findById(roleId);
        if (!role) throw new NotFoundError("Role not found");

        const permission = await permissionRepository.findById(permissionId);
        if (!permission) throw new NotFoundError("Permission not found");

        if (role.applicationId !== permission.applicationId) {
            throw new ForbiddenError("Permission does not belong to role application");
        }

        const app = await applicationRepository.findById(role.applicationId);

        if (!currentUser.is_global_admin &&
            app.tenantId !== currentUser.tenantId) {
            throw new ForbiddenError("Access denied");
        }

        await rolePermissionRepository.addPermission(roleId, permissionId);
    }

    async removePermission(currentUser, roleId, permissionId) {
        const role = await roleRepository.findById(roleId);
        if (!role) throw new NotFoundError("Role not found");

        const app = await applicationRepository.findById(role.applicationId);

        if (!currentUser.is_global_admin &&
            app.tenantId !== currentUser.tenantId) {
            throw new ForbiddenError("Access denied");
        }

        await rolePermissionRepository.removePermission(roleId, permissionId);
    }

    async listPermissions(currentUser, roleId) {
        const role = await roleRepository.findById(roleId);
        if (!role) throw new NotFoundError("Role not found");

        const app = await applicationRepository.findById(role.applicationId);

        if (!currentUser.is_global_admin &&
            app.tenantId !== currentUser.tenantId) {
            throw new ForbiddenError("Access denied");
        }

        return rolePermissionRepository.findPermissionsByRole(roleId);
    }
}
