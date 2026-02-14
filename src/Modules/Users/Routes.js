import { authenticate } from '../../Middlewares/Authenticate.js';
import { authorize } from '../../Middlewares/Authorize.js';

import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deactivateUser,
} from './UserController.js';

export default async function userRoutes(fastify) {
  fastify.get(
    '/',
    {
      preHandler: [authenticate, authorize('manage_users')],
    },
    listUsers
  );

  fastify.get(
    '/:id',
    {
      preHandler: [authenticate, authorize('manage_users')],
    },
    getUser
  );

  fastify.post(
    '/',
    {
      preHandler: [authenticate, authorize('manage_users')],
    },
    createUser
  );

  fastify.patch(
    '/:id',
    {
      preHandler: [authenticate, authorize('manage_users')],
    },
    updateUser
  );

  fastify.delete(
    '/:id',
    {
      preHandler: [authenticate, authorize('manage_users')],
    },
    deactivateUser
  );
}
