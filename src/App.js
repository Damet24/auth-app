import Fastify from "fastify";
import {AppError} from "./Domain/Errors/AppError.js";
import authRoutes from "./Modules/Auth/Routes.js";
import userRoutes from "./Modules/Users/Routes.js";

export function buildApp() {
    const app = Fastify({logger: true});

    app.setErrorHandler((error, request, reply) => {

        if (error instanceof AppError) {
            return reply
                .code(error.statusCode)
                .send({
                    error: error.code,
                    message: error.message
                });
        }

        request.log.error(error);

        return reply
            .code(500)
            .send({
                error: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong"
            });
    });

    app.get("/", (req, res) => {
        return { hello: 'world' }
    })

    app.register(authRoutes, { prefix: "/auth" });
    app.register(userRoutes, { prefix: "/users" });

    return app;
}