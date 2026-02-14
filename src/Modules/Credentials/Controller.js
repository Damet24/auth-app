import { z } from 'zod';
import { CredentialService } from './Service.js';

const service = new CredentialService();

export async function changePassword(request, reply) {

    const paramsSchema = z.object({
        id: z.string().uuid()
    });

    const bodySchema = z.object({
        newPassword: z.string().min(8)
    });

    const { id } = paramsSchema.parse(request.params);
    const { newPassword } = bodySchema.parse(request.body);

    await service.changePassword(request.user, id, newPassword);

    return reply.code(204).send();
}
