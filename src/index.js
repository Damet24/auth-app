import {Server} from './server.js'
import routes from './routes/index.js'

const server = new Server(8080, routes)
server.listen()