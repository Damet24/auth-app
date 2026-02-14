import {z} from 'zod';
import {Service} from './Service.js';

const service = new Service();

export async function listUsers(request, reply) {
    const users = await service.listUsers(request.user);
    return reply.send(users);
}

export async function getUser(request, reply) {
    const schema = z.object({
        id: z.uuid(),
    });

    const {id} = schema.parse(request.params);

    const user = await service.getUserById(request.user, id);

    return reply.send(user);
}

export async function createUser(request, reply) {
    const schema = z.object({
        email: z.email(),
        is_global_admin: z.boolean().optional(),
        tenant_id: z.uuid(),
    });

    const data = schema.parse(request.body);

    const user = await service.createUser(request.user, data);

    return reply.code(201).send(user);
}

export async function updateUser(request, reply) {
    const paramsSchema = z.object({
        id: z.uuid(),
    });

    const bodySchema = z.object({
        emailVerified: z.boolean().optional(),
        active: z.boolean().optional(),
    });

    const {id} = paramsSchema.parse(request.params);
    const updateData = bodySchema.parse(request.body);

    const user = await service.updateUser(request.user, id, updateData);

    return reply.send(user);
}

export async function deactivateUser(request, reply) {
    const schema = z.object({
        id: z.uuid(),
    });

    const {id} = schema.parse(request.params);

    await service.deactivateUser(request.user, id);

    return reply.code(204).send();
}

export async function assignRole(request, reply) {
    const schema = z.object({
        userId: z.uuid(),
        roleId: z.uuid(),
    });

    const {userId, roleId} = schema.parse(request.body);

    await service.assignRole(request.user, userId, roleId);

    return reply.code(204).send();
}

export async function removeRole(request, reply) {
    const schema = z.object({
        userId: z.uuid(),
        roleId: z.uuid(),
    });

    const {userId, roleId} = schema.parse(request.body);

    await service.removeRole(request.user, userId, roleId);

    return reply.code(204).send();
}

export async function listUserRoles(request, reply) {
    const schema = z.object({userId: z.uuid()});
    const {userId} = schema.parse(request.params);

    const result = await service.listUserRoles(request.user, userId);

    return reply.send(result);
}

export async function register(request, reply) {
    const schema = z.object({
        email: z.email(),
        password: z.string().min(8),
        tenant_id: z.uuid(),
        is_global_admin: z.boolean().optional(),
    });

    const {email, password, tenant_id, is_global_admin = false} = schema.parse(request.body);

    const user = await service.registerUser(request.user, {email, password, tenantId: tenant_id});

    return reply.code(201).send(user);
}