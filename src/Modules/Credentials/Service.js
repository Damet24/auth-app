import bcrypt from 'bcrypt';
import { credentialsRepository } from '../../Domain/Repositories/index.js';
import { ForbiddenError, NotFoundError } from '../../Domain/Errors/AppError.js';

export class CredentialService {

    async createLocalCredential(userId, password) {
        const hash = await bcrypt.hash(password, 12);

        return await credentialsRepository.createLocal(userId, hash);
    }

    async changePassword(currentUser, userId, newPassword) {

        if (!currentUser.is_global_admin &&
            currentUser.sub !== userId) {
            throw new ForbiddenError("Cannot change another user's password");
        }

        const credential = await credentialsRepository.findLocalByUserId(userId);

        if (!credential) {
            throw new NotFoundError("Credential not found");
        }

        const hash = await bcrypt.hash(newPassword, 12);

        await credentialsRepository.updatePassword(userId, hash);
    }
}
