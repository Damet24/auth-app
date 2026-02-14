import { authenticate } from '../../Middlewares/Authenticate.js';
import { authorize } from '../../Middlewares/Authorize.js';
import { listPermissions, createPermission } from './Controller.js';
import {PERMISSIONS} from "../../Domain/Constants/Permissions.js";

export default async function permissionRoutes(fastify) {

    fastify.get(
        '/:applicationId',
        { preHandler: [authenticate, authorize(PERMISSIONS.APPLICATION.READ)] },
        listPermissions
    );

    fastify.post(
        '/:applicationId',
        { preHandler: [authenticate, authorize(PERMISSIONS.APPLICATION.UPDATE)] },
        createPermission
    );
}
