import express from 'express'
import httpStatus from "http-status";
import HttpStatus from "http-status";

export class Server {
    constructor(port, routes) {
        this.server = express()
        this.port = port
        this.routes = routes
        this.#initialize()
        this.#configureRoutes()
    }
    
    #initialize() {
        this.server.use(express.json())
        this.server.use(express.urlencoded({ extended: true }))
    }
    
    #configureRoutes() {
        this.server.use('/api', this.routes)
        this.server.use((request, response, next) => {
            response.status(httpStatus.NOT_FOUND).json({ error: httpStatus.NOT_FOUND, body: httpStatus[404] })
        })
        this.server.use((error, _, response, next) => {
            if(error.name === 'HttpError' && error.show) {
                console.error(error)
                response
                    .status(error.status)
                    .send({message: error.message})
            } else {
                console.error(error)
                response
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send({message: HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR]})
            }
        })
    }
    
    listen() {
        this.server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`)
        })
    }
}
