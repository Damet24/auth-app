import { z } from 'zod';
import { ApplicationService } from './ApplicationService.js';

const service = new ApplicationService();

export async function listApplications(request, reply) {
  const apps = await service.listApplications(request.user);
  return reply.send(apps);
}

export async function createApplication(request, reply) {
  const schema = z.object({
    name: z.string().min(3),
    redirectUrl: z.string().url().optional(),
    tokenStrategy: z.string().optional(),
    accessTokenTtl: z.number().optional(),
    refreshTokenTtl: z.number().optional(),
  });

  const data = schema.parse(request.body);

  const app = await service.createApplication(request.user, data);

  return reply.code(201).send(app);
}

export async function updateApplication(request, reply) {
  const paramsSchema = z.object({ id: z.string().uuid() });
  const bodySchema = z.object({
    name: z.string().min(3).optional(),
    redirectUrl: z.string().url().optional(),
    tokenStrategy: z.string().optional(),
    accessTokenTtl: z.number().optional(),
    refreshTokenTtl: z.number().optional(),
    active: z.boolean().optional(),
  });

  const { id } = paramsSchema.parse(request.params);
  const data = bodySchema.parse(request.body);

  const app = await service.updateApplication(request.user, id, data);

  return reply.send(app);
}
