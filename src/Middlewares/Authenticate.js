import jwt from "jsonwebtoken";
import { publicKey } from "../Config/Jwt.js";
import { userRepository } from "../Domain/Repositories/index.js";
import { TokenInvalidatedError } from "../Domain/Errors/AuthErrors.js";

export async function authenticate(request, reply) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return reply.code(401).send({ error: "Missing token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, publicKey, {
            algorithms: ["RS256"]
        });

        const user = await userRepository.findById(payload.sub);

        if (!user || user.tokenVersion !== payload.token_version) {
            throw new TokenInvalidatedError();
        }

        request.user = {
            ...payload,
            is_global_admin: user.isGlobalAdmin
        };

    } catch (err) {
        return reply.code(401).send({ error: "Invalid token" });
    }
}

