import {userRepository} from "../../Domain/Repositories/index.js";


export class UserService {
    async listUsers(isGlobalAdmin, tenantId) {
        if (isGlobalAdmin) return await userRepository.findAll()
        return await userRepository.findByTenant(tenantId)
    }
}