import {authenticate} from "../../Middlewares/Authenticate.js";
import {authorize} from "../../Middlewares/Authorize.js";
import {listUsers} from "./UserController.js";


export default async function userRoutes(fastify) {
    fastify.get('/', {
        preHandler: [authenticate, authorize("manage_users")],
    }, listUsers)
}
