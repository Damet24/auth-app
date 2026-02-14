import { authenticate } from '../../Middlewares/Authenticate.js';
import { authorize } from '../../Middlewares/Authorize.js';
import {
  listApplications,
  createApplication,
  updateApplication,
} from './ApplicationController.js';
import { PERMISSIONS } from '../Auth/Permissions.js';

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
