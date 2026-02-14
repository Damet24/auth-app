import { Service } from './Service.js';
import { z } from 'zod';
import { validate } from '../../utils/validate.js';

const service = new Service();

export async function login(request, reply) {
  const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    client_id: z.string().min(1),
  });

  const { email, password, client_id } = loginSchema.parse(request.body);

  const result = await service.login({
    email,
    password,
    clientId: client_id,
  });

  return reply.send(result);
}

export async function refresh(request, reply) {
  const refreshSchema = z.object({
    refresh_token: z.string().min(1),
  });

  const { refresh_token } = refreshSchema.parse(request.body);

  const result = await service.refresh(refresh_token);

  return reply.send(result);
}
