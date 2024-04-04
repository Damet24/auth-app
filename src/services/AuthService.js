import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import HttpStatus from "http-status";
import {HttpError} from "../errors/HttpError.js";
import JWT from 'jsonwebtoken'

export class AuthService {
    /**
     * @param {AuthRepository} authRepository
     * @param {number} salt
     * @param {string} secret
     */
    constructor(authRepository, salt, secret) {
        this._secret = secret
        this.salt = salt
        this._authRepository = authRepository
    }
    
    async create({email, password}) {
        await this.#getAccountAndValidate({email})
        const id = uuidv4()
        const passwordHash = bcrypt.hashSync(password, this.salt)
        await this._authRepository.save({id, email, passwordHash})
    }
    
    async login({email, password}) {
        const account = await this.#getAccountAndValidate({email})
        if (account === undefined)
            throw new HttpError({status: HttpStatus.BAD_REQUEST, message: 'Bad credentials'})
        if (!bcrypt.compareSync(password, account.passwordHash))
            throw new HttpError({status: HttpStatus.BAD_REQUEST, message: 'Bad credentials'})
        return {token: this.#sign(account)}
    }

    async #getAccountAndValidate({email}) {
        const account = await this._authRepository.getByEmail({email})
        if (account) {
            throw new HttpError({
                status: HttpStatus.BAD_REQUEST,
                message: 'Email already exests'})
        }
        else return account
    }

    #sign(payload) {
        return JWT.sign(payload, this._secret)
    }
}
