import { z } from 'zod';
import { RoleService } from './Service.js';

const service = new RoleService();

export async function listRoles(request, reply) {
    const schema = z.object({ applicationId: z.string().uuid() });
    const { applicationId } = schema.parse(request.params);

    const result = await service.listRoles(request.user, applicationId);
    return reply.send(result);
}

export async function createRole(request, reply) {
    const paramsSchema = z.object({ applicationId: z.string().uuid() });
    const bodySchema = z.object({ name: z.string().min(3) });

    const { applicationId } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    const result = await service.createRole(request.user, applicationId, data);

    return reply.code(201).send(result);
}

export async function updateRole(request, reply) {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const bodySchema = z.object({
        name: z.string().min(3).optional(),
        active: z.boolean().optional()
    });

    const { id } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    const result = await service.updateRole(request.user, id, data);

    return reply.send(result);
}
