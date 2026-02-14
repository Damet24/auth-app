import { authenticate } from '../../Middlewares/Authenticate.js';
import { authorize } from '../../Middlewares/Authorize.js';
import { changePassword } from './Controller.js';
import {PERMISSIONS} from "../../Domain/Constants/Permissions.js";

export default async function credentialRoutes(fastify) {

    fastify.patch(
        '/:id/password',
        {
            preHandler: [
                authenticate,
                authorize(PERMISSIONS.USER.UPDATE)
            ]
        },
        changePassword
    );
}
