import {
    applicationRepository, credentialsRepository,
    roleRepository,
    userRepository,
    userRoleRepository,
} from '../../Domain/Repositories/index.js';
import {
    ForbiddenError,
    NotFoundError,
} from '../../Domain/Errors/AuthErrors.js';
import {UserAlreadyExists} from '../../Domain/Errors/UserErrors.js';
import {ConflictError} from "../../Domain/Errors/AppError.js";

export class Service {
    async listUsers(currentUser) {
        if (currentUser.isGlobalAdmin) {
            return await userRepository.findAll();
        }

        return await userRepository.findByTenant(currentUser.tenantId);
    }

    async getUserById(currentUser, userId) {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (!currentUser.isGlobalAdmin && user.tenantId !== currentUser.tenantId) {
            throw new ForbiddenError('Cannot access user from another tenant');
        }

        return user;
    }

    async createUser(currentUser, {email, tenant_id, is_global_admin = false}) {
        if (is_global_admin && !currentUser.isGlobalAdmin) {
            throw new ForbiddenError('Only global admin can create global admins');
        }

        const tenantId = currentUser.isGlobalAdmin
            ? currentUser.tenantId
            : tenant_id;

        const exists = await userRepository.existsByEmail(tenantId, email);

        if (exists) {
            throw new UserAlreadyExists();
        }

        return await userRepository.create({
            tenantId,
            email,
            emailVerified: false,
            active: true,
            is_global_admin,
        });
    }

    async updateUser(currentUser, userId, updateData) {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (!currentUser.isGlobalAdmin && user.tenantId !== currentUser.tenantId) {
            throw new ForbiddenError('Cannot update user from another tenant');
        }

        return await userRepository.update(userId, updateData);
    }

    async deactivateUser(currentUser, userId) {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (!currentUser.isGlobalAdmin && user.tenantId !== currentUser.tenantId) {
            throw new ForbiddenError('Cannot deactivate user from another tenant');
        }

        await userRepository.deactivate(userId);
    }

    async assignRole(currentUser, userId, roleId) {
        const user = await userRepository.findById(userId);
        if (!user) throw new NotFoundError('User not found');

        const role = await roleRepository.findById(roleId);
        if (!role) throw new NotFoundError('Role not found');

        const app = await applicationRepository.findById(role.applicationId);

        if (!currentUser.is_global_admin && app.tenantId !== currentUser.tenantId) {
            throw new ForbiddenError('Access denied');
        }

        if (
            !currentUser.is_global_admin &&
            user.tenantId !== currentUser.tenantId
        ) {
            throw new ForbiddenError(
                'Cannot assign role to user from another tenant'
            );
        }

        await userRoleRepository.addRole(userId, roleId);
    }

    async removeRole(currentUser, userId, roleId) {
        const user = await userRepository.findById(userId);
        if (!user) throw new NotFoundError('User not found');

        if (
            !currentUser.is_global_admin &&
            user.tenantId !== currentUser.tenantId
        ) {
            throw new ForbiddenError('Access denied');
        }

        await userRoleRepository.removeRole(userId, roleId);
    }

    async registerUser(currentUser, {email, password, tenantId}) {
        const exists = await userRepository.existsByEmail(tenantId, email);
        if (exists) {
            throw new UserAlreadyExists();
        }

        const user = await userRepository.create({
            tenantId,
            email,
            emailVerified: false,
            active: true,
            isGlobalAdmin: false
        });

        await credentialsRepository.createLocal(user.id, password);

        return user;
    }
}
