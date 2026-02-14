import { authenticate } from '../../Middlewares/Authenticate.js';
import { authorize } from '../../Middlewares/Authorize.js';

import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deactivateUser,
} from './Controller.js';
import { PERMISSIONS } from '../../Domain/Constants/Permissions.js';

export default async function userRoutes(fastify) {
  fastify.get(
    '/',
    {
      preHandler: [authenticate, authorize(PERMISSIONS.USER.READ)],
    },
    listUsers
  );

  fastify.get(
    '/:id',
    {
      preHandler: [authenticate, authorize(PERMISSIONS.USER.READ)],
    },
    getUser
  );

  fastify.post(
    '/',
    {
      preHandler: [authenticate, authorize(PERMISSIONS.USER.CREATE)],
    },
    createUser
  );

  fastify.patch(
    '/:id',
    {
      preHandler: [authenticate, authorize(PERMISSIONS.USER.UPDATE)],
    },
    updateUser
  );

  fastify.delete(
    '/:id',
    {
      preHandler: [authenticate, authorize(PERMISSIONS.USER.DELETE)],
    },
    deactivateUser
  );
}
