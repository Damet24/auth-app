import { authenticate } from '../../Middlewares/Authenticate.js';
import { authorize } from '../../Middlewares/Authorize.js';

import {
  listTenants,
  getTenant,
  createTenant,
  updateTenant,
  deactivateTenant,
} from './TenantController.js';
import { PERMISSIONS } from '../Auth/Permissions.js';

export default async function tenantRoutes(fastify) {
  fastify.get(
    '/',
    {
      preHandler: [authenticate, authorize(PERMISSIONS.TENANT.READ)],
    },
    listTenants
  );

  fastify.get(
    '/:id',
    {
      preHandler: [authenticate, authorize(PERMISSIONS.TENANT.READ)],
    },
    getTenant
  );

  fastify.post(
    '/',
    {
      preHandler: [authenticate, authorize(PERMISSIONS.TENANT.CREATE)],
    },
    createTenant
  );

  fastify.patch(
    '/:id',
    {
      preHandler: [authenticate, authorize(PERMISSIONS.TENANT.UPDATE)],
    },
    updateTenant
  );

  fastify.delete(
    '/:id',
    {
      preHandler: [authenticate, authorize(PERMISSIONS.TENANT.DELETE)],
    },
    deactivateTenant
  );
}
