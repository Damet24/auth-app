import Fastify from 'fastify';
import {AppError} from './Domain/Errors/AppError.js';
import authRoutes from './Modules/Auth/Routes.js';
import userRoutes from './Modules/Users/Routes.js';
import {ZodError} from 'zod';
import tenantRoutes from './Modules/Tenants/Routes.js';
import applicationRoutes from './Modules/Applications/Routes.js';
import permissionRoutes from './Modules/Permissions/Routes.js';
import roleRoutes from './Modules/Roles/Routes.js';
import credentialRoutes from "./Modules/Credentials/Routes.js";

export function buildApp() {
    const app = Fastify({logger: true});

    app.setErrorHandler((error, request, reply) => {
        if (error instanceof ZodError) {
            return reply.code(400).send({
                error: 'VALIDATION_ERROR',
                message: 'Invalid request data',
                details: error.flatten().fieldErrors,
            });
        }

        if (error instanceof AppError) {
            return reply.code(error.statusCode).send({
                error: error.code,
                message: error.message,
            });
        }

        request.log.error(error);

        return reply.code(500).send({
            error: 'INTERNAL_SERVER_ERROR',
            message:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : 'Something went wrong',
        });
    });

    app.get('/', async () => {
        return {hello: 'world'};
    });

    app.register(authRoutes, {prefix: '/auth'});
    app.register(userRoutes, {prefix: '/users'});
    app.register(tenantRoutes, {prefix: '/tenants'});
    app.register(applicationRoutes, {prefix: '/applications'});
    app.register(permissionRoutes, {prefix: '/permissions'});
    app.register(roleRoutes, {prefix: '/roles'});
    app.register(credentialRoutes, {prefix: '/credentials'});

    return app;
}
