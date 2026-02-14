import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { applicationRepository } from '../../Domain/Repositories/index.js';
import { ForbiddenError, NotFoundError } from '../../Domain/Errors/AppError.js';

export class Service {
  async listApplications(currentUser) {
    if (currentUser.is_global_admin) {
      return await applicationRepository.findByTenant(currentUser.tenantId);
    }

    return await applicationRepository.findByTenant(currentUser.tenantId);
  }

  async createApplication(currentUser, data) {
    if (!currentUser.tenantId) {
      throw new ForbiddenError('Invalid tenant context');
    }

    const clientId = crypto.randomUUID();
    const clientSecret = crypto.randomBytes(32).toString('hex');
    const clientSecretHash = await bcrypt.hash(clientSecret, 10);

    const app = await applicationRepository.create({
      tenantId: currentUser.tenantId,
      name: data.name,
      clientId,
      clientSecretHash,
      redirectUrl: data.redirectUrl,
      tokenStrategy: data.tokenStrategy,
      accessTokenTtl: data.accessTokenTtl,
      refreshTokenTtl: data.refreshTokenTtl,
    });

    return {
      ...app,
      clientSecret,
    };
  }

  async updateApplication(currentUser, appId, data) {
    const app = await applicationRepository.findById(appId);

    if (!app) throw new NotFoundError('Application not found');

    if (!currentUser.is_global_admin && app.tenantId !== currentUser.tenantId) {
      throw new ForbiddenError('Cannot modify application from another tenant');
    }

    return await applicationRepository.update(appId, data);
  }
}
