import { tenantRepository } from '../../Domain/Repositories/index.js';
import {
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../../Domain/Errors/AppError.js';

export class Service {
  async listTenants(currentUser) {
    if (!currentUser.isGlobalAdmin) {
      throw new ForbiddenError('Only global admin can list tenants');
    }

    return await tenantRepository.findAll();
  }

  async getTenantById(currentUser, tenantId) {
    if (!currentUser.isGlobalAdmin) {
      throw new ForbiddenError('Only global admin can view tenants');
    }

    const tenant = await tenantRepository.findById(tenantId);

    if (!tenant) {
      throw new NotFoundError('Tenant not found');
    }

    return tenant;
  }

  async createTenant(currentUser, { name }) {
    if (!currentUser.isGlobalAdmin) {
      throw new ForbiddenError('Only global admin can create tenants');
    }

    const exists = await tenantRepository.existsByName(name);

    if (exists) {
      throw new ConflictError('Tenant name already exists');
    }

    return await tenantRepository.create({ name });
  }

  async updateTenant(currentUser, tenantId, { name }) {
    if (!currentUser.isGlobalAdmin) {
      throw new ForbiddenError('Only global admin can update tenants');
    }

    const tenant = await tenantRepository.findById(tenantId);

    if (!tenant) {
      throw new NotFoundError('Tenant not found');
    }

    if (name) {
      const exists = await tenantRepository.existsByName(name);
      if (exists && tenant.name !== name) {
        throw new ConflictError('Tenant name already exists');
      }
    }

    return await tenantRepository.update(tenantId, { name });
  }

  async deactivateTenant(currentUser, tenantId) {
    if (!currentUser.isGlobalAdmin) {
      throw new ForbiddenError('Only global admin can deactivate tenants');
    }

    const tenant = await tenantRepository.findById(tenantId);

    if (!tenant) {
      throw new NotFoundError('Tenant not found');
    }

    await tenantRepository.deactivate(tenantId);
  }
}
