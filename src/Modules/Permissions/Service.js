import {
  permissionRepository,
  applicationRepository,
} from '../../Domain/Repositories/index.js';
import {
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../../Domain/Errors/AppError.js';

export class Service {
  async listPermissions(currentUser, applicationId) {
    const app = await applicationRepository.findById(applicationId);
    if (!app) throw new NotFoundError('Application not found');

    if (!currentUser.is_global_admin && app.tenantId !== currentUser.tenantId) {
      throw new ForbiddenError('Access denied');
    }

    return permissionRepository.findByApplication(applicationId);
  }

  async createPermission(currentUser, applicationId, { name }) {
    const app = await applicationRepository.findById(applicationId);
    if (!app) throw new NotFoundError('Application not found');

    if (!currentUser.is_global_admin && app.tenantId !== currentUser.tenantId) {
      throw new ForbiddenError('Access denied');
    }

    const exists = await permissionRepository.exists(applicationId, name);
    if (exists) throw new ConflictError('Permission already exists');

    return permissionRepository.create({ applicationId, name });
  }
}
