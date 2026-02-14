import { z } from 'zod';
import { Service } from './Service.js';

const service = new Service();

export async function listPermissions(request, reply) {
  const schema = z.object({ applicationId: z.string().uuid() });
  const { applicationId } = schema.parse(request.params);

  const result = await service.listPermissions(request.user, applicationId);
  return reply.send(result);
}

export async function createPermission(request, reply) {
  const paramsSchema = z.object({ applicationId: z.uuid() });
  const bodySchema = z.object({ name: z.string().min(3) });

  const { applicationId } = paramsSchema.parse(request.params);
  const data = bodySchema.parse(request.body);

  const result = await service.createPermission(
    request.user,
    applicationId,
    data
  );

  return reply.code(201).send(result);
}
