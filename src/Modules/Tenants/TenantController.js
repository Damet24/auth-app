import { z } from 'zod';
import { TenantService } from './TenantService.js';

const service = new TenantService();

export async function listTenants(request, reply) {
  const tenants = await service.listTenants(request.user);
  return reply.send(tenants);
}

export async function getTenant(request, reply) {
  const schema = z.object({
    id: z.uuid(),
  });

  const { id } = schema.parse(request.params);

  const tenant = await service.getTenantById(request.user, id);

  return reply.send(tenant);
}

export async function createTenant(request, reply) {
  const schema = z.object({
    name: z.string().min(3),
  });

  const data = schema.parse(request.body);

  const tenant = await service.createTenant(request.user, data);

  return reply.code(201).send(tenant);
}

export async function updateTenant(request, reply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const bodySchema = z.object({
    name: z.string().min(3).optional(),
  });

  const { id } = paramsSchema.parse(request.params);
  const updateData = bodySchema.parse(request.body);

  const tenant = await service.updateTenant(request.user, id, updateData);

  return reply.send(tenant);
}

export async function deactivateTenant(request, reply) {
  const schema = z.object({
    id: z.uuid(),
  });

  const { id } = schema.parse(request.params);

  await service.deactivateTenant(request.user, id);

  return reply.code(204).send();
}
