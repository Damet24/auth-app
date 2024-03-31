import HttpStatus from 'http-status'

export class AuthController {
    constructor(authService) {
        this._authService = authService
    }
    
    ssigin (request, response, next) {
        response.status(HttpStatus.OK).json({data: 'user created'})
    }
    
    async signup (request, response, next) {
        try {
            await this._authService.create({email: 'admin', password: '1234'})
            response.status(HttpStatus.CREATED).json({data: 'user created'})
        } catch (error) {
            next(error)
        }
    }
}