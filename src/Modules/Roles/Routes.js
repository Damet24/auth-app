import { authenticate } from '../../Middlewares/Authenticate.js';
import { authorize } from '../../Middlewares/Authorize.js';
import {
    listRoles,
    createRole,
    updateRole, listRolePermissions, assignPermission, removePermission
} from './Controller.js';
import {PERMISSIONS} from "../../Domain/Constants/Permissions.js";


export default async function roleRoutes(fastify) {

    fastify.get(
        '/:applicationId',
        { preHandler: [authenticate, authorize(PERMISSIONS.ROLE.READ)] },
        listRoles
    );

    fastify.post(
        '/:applicationId',
        { preHandler: [authenticate, authorize(PERMISSIONS.ROLE.CREATE)] },
        createRole
    );

    fastify.patch(
        '/:id',
        { preHandler: [authenticate, authorize(PERMISSIONS.ROLE.UPDATE)] },
        updateRole
    );

    fastify.get(
        '/:roleId/permissions',
        { preHandler: [authenticate, authorize(PERMISSIONS.ROLE.READ)] },
        listRolePermissions
    );

    fastify.post(
        '/permissions',
        { preHandler: [authenticate, authorize(PERMISSIONS.ROLE.UPDATE)] },
        assignPermission
    );

    fastify.delete(
        '/permissions',
        { preHandler: [authenticate, authorize(PERMISSIONS.ROLE.UPDATE)] },
        removePermission
    );

}
