import { userRepository } from '../../Domain/Repositories/index.js';
import {
  ForbiddenError,
  NotFoundError,
} from '../../Domain/Errors/AuthErrors.js';

export class UserService {
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

    if (
      !currentUser.isGlobalAdmin &&
      user.tenantId !== currentUser.tenantId
    ) {
      throw new ForbiddenError('Cannot access user from another tenant');
    }

    return user;
  }

  async createUser(currentUser, { email, isGlobalAdmin = false }) {
    if (isGlobalAdmin && !currentUser.isGlobalAdmin) {
      throw new ForbiddenError('Only global admin can create global admins');
    }

    const tenantId = currentUser.isGlobalAdmin
      ? currentUser.tenantId
      : currentUser.tenantId;

    const exists = await userRepository.existsByEmail(tenantId, email);

    if (exists) {
      throw new Error('User already exists');
    }

    return await userRepository.create({
      tenantId,
      email,
      emailVerified: false,
      active: true,
      isGlobalAdmin,
    });
  }

  async updateUser(currentUser, userId, updateData) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (
      !currentUser.isGlobalAdmin &&
      user.tenantId !== currentUser.tenantId
    ) {
      throw new ForbiddenError('Cannot update user from another tenant');
    }

    return await userRepository.update(userId, updateData);
  }

  async deactivateUser(currentUser, userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (
      !currentUser.isGlobalAdmin &&
      user.tenantId !== currentUser.tenantId
    ) {
      throw new ForbiddenError('Cannot deactivate user from another tenant');
    }

    await userRepository.deactivate(userId);
  }
}
