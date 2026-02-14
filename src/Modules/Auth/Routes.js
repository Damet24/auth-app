import { login, refresh } from './Controller.js';

export default async function authRoutes(fastify) {
  fastify.post('/login', login);
  fastify.post('/refresh', refresh);
}
