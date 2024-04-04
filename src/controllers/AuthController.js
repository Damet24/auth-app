import HttpStatus from 'http-status'

export class AuthController {
    /**
     * @param {AuthService} authService
     */
    constructor(authService) {
        this._authService = authService
    }
    
    sigin (request, response, next) {
        response.status(HttpStatus.OK).json({data: 'user created'})
    }
    
    async signup (request, response, next) {
        try {
            const body = request.body
            await this._authService.create(body)
            const credentials = await this._authService.login(body)
            response.status(HttpStatus.CREATED).json({data: credentials})
        } catch (error) {
            next(error)
        }
    }

    async login (request, response, next) {
        try {
            const body = request.body
            await this._authService.login(body)
            const credentials = await this._authService.login(body)
            response.status(HttpStatus.OK).json({data: credentials})
        } catch (error) {
            next(error)
        }
    }
}