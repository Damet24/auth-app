import { v4 as uuidv4 } from 'uuid'
import { hashSync } from 'bcrypt'

export class AuthService {
    constructor(authRepository, salt) {
        this.salt = salt
        this._authRepository = authRepository
    }
    
    async create({email, password}) {
        const id = uuidv4()
        const passwordHash = hashSync(password, this.salt)
        await this._authRepository.save({id, email, passwordHash})
    }
    
    async login({email, password}) {
        
    }
}
