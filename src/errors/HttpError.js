
export class HttpError extends Error {
    constructor({status, message, show}) {
        super(message);
        this.name = 'HttpError'
        this.status = status
        this.show = show
    }
}