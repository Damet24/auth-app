import { login, refresh } from "./AuthController.js";

export default async function authRoutes(fastify) {
    fastify.post("/login", login);
    fastify.post("/refresh", refresh);
}
