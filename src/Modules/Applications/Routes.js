import { authenticate } from '../../Middlewares/Authenticate.js';
import { authorize } from '../../Middlewares/Authorize.js';
import {
  listApplications,
  createApplication,
  updateApplication,
} from './Controller.js';
import { PERMISSIONS } from '../../Domain/Constants/Permissions.js';

export default async function applicationRoutes(fastify) {
  fastify.get(
    '/',
    { preHandler: [authenticate, authorize(PERMISSIONS.APPLICATION.READ)] },
    listApplications
  );

  fastify.post(
    '/',
    { preHandler: [authenticate, authorize(PERMISSIONS.APPLICATION.CREATE)] },
    createApplication
  );

  fastify.patch(
    '/:id',
    { preHandler: [authenticate, authorize(PERMISSIONS.APPLICATION.UPDATE)] },
    updateApplication
  );
}
