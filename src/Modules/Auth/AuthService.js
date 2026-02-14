import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import { privateKey } from "../../Config/Jwt.js";
import { generateRefreshToken, hashToken } from "../../Infrastructure/Crypto/Token.js";

import {
    applicationRepository,
    credentialsRepository,
    permissionRepository,
    roleRepository,
    sessionRepo,
    tenantRepository,
    userRepository
} from "../../Domain/Repositories/index.js";

import redis from "../../Infrastructure/Redis/RedisClient.js";

import {
    InvalidClientError,
    InvalidCredentialsError,
    InvalidRefreshTokenError,
    TenantInactiveError,
    TokenExpiredError,
    TokenInvalidatedError
} from "../../Domain/Errors/AuthErrors.js";

function calculateExpiration(seconds) {
    return new Date(Date.now() + seconds * 1000);
}

export class AuthService {

    // =============================
    // LOGIN
    // =============================
    async login({ email, password, clientId }) {

        if (!clientId || !email || !password) {
            throw new InvalidCredentialsError();
        }

        const application = await applicationRepository.findByClientId(clientId);
        if (!application || !application.active) {
            throw new InvalidClientError();
        }

        const tenant = await tenantRepository.findById(application.tenantId);
        if (!tenant || !tenant.active) {
            throw new TenantInactiveError();
        }

        const user = await userRepository.findByEmail(tenant.id, email);
        if (!user || !user.active) {
            throw new InvalidCredentialsError();
        }

        const credentials = await credentialsRepository.findLocalByUserId(user.id);
        if (!credentials) {
            throw new InvalidCredentialsError();
        }

        const valid = await bcrypt.compare(password, credentials.passwordHash);
        if (!valid) {
            throw new InvalidCredentialsError();
        }

        // 🔥 Global admin no depende de roles
        let roles = [];
        let permissions = [];

        if (!user.isGlobalAdmin) {
            roles = await roleRepository.findByUserAndApp(user.id, application.id);
            permissions = await permissionRepository.findByUserAndApp(user.id, application.id);
        }


        const payload = {
            sub: user.id,
            tenant_id: user.tenantId,
            app_id: application.id,
            is_global_admin: user.isGlobalAdmin,
            roles,
            permissions,
            token_version: user.tokenVersion,
            jti: crypto.randomUUID()
        };

        const accessToken = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: application.accessTokenTtl || "15m"
        });

        // 🔁 Refresh Token
        const { token, jti } = generateRefreshToken();
        const hashedToken = hashToken(token);

        const refreshTtl = application.refreshTokenTtl || 604800;

        await sessionRepo.create({
            id: jti,
            userId: user.id,
            applicationId: application.id,
            refreshTokenHash: hashedToken,
            tokenVersion: user.tokenVersion,
            expiresAt: calculateExpiration(refreshTtl),
            revoked: false
        });

        await redis.set(
            `refresh:${jti}`,
            JSON.stringify({
                userId: user.id,
                applicationId: application.id,
                tokenVersion: user.tokenVersion
            }),
            "EX",
            refreshTtl
        );

        return {
            access_token: accessToken,
            refresh_token: token,
            expires_in: application.accessTokenTtl || 900
        };
    }

    // =============================
    // REFRESH
    // =============================
    async refresh(refreshToken) {

        if (!refreshToken) {
            throw new InvalidRefreshTokenError();
        }

        const decoded = Buffer.from(refreshToken, "base64").toString("utf8");
        const [jti] = decoded.split(".");

        if (!jti) {
            throw new InvalidRefreshTokenError();
        }

        // 🔍 Redis first
        const cached = await redis.get(`refresh:${jti}`);

        let dbSession = await sessionRepo.findById(jti);

        if (!dbSession || dbSession.revoked) {
            throw new InvalidRefreshTokenError();
        }

        // 🔁 Rehydrate Redis if needed
        if (!cached) {
            const ttlSeconds = Math.floor(
                (new Date(dbSession.expiresAt) - Date.now()) / 1000
            );

            if (ttlSeconds > 0) {
                await redis.set(
                    `refresh:${jti}`,
                    JSON.stringify({
                        userId: dbSession.userId,
                        applicationId: dbSession.applicationId,
                        tokenVersion: dbSession.tokenVersion
                    }),
                    "EX",
                    ttlSeconds
                );
            }
        }

        if (new Date() > new Date(dbSession.expiresAt)) {
            throw new TokenExpiredError();
        }

        if (hashToken(refreshToken) !== dbSession.refreshTokenHash) {
            await userRepository.incrementTokenVersion(dbSession.userId);
            throw new TokenInvalidatedError();
        }

        const user = await userRepository.findById(dbSession.userId);

        if (!user || user.tokenVersion !== dbSession.tokenVersion) {
            throw new TokenInvalidatedError();
        }

        const application = await applicationRepository.findById(dbSession.applicationId);

        // 🔁 Rotate session
        await sessionRepo.revoke(jti);
        await redis.del(`refresh:${jti}`);

        let roles = [];
        let permissions = [];

        if (!user.isGlobalAdmin) {
            roles = await roleRepository.findByUserAndApp(user.id, application.id);
            permissions = await permissionRepository.findByUserAndApp(user.id, application.id);
        }

        const newAccessToken = jwt.sign({
            sub: user.id,
            tenant_id: user.tenantId,
            app_id: application.id,
            is_global_admin: user.isGlobalAdmin,
            roles,
            permissions,
            token_version: user.tokenVersion,
            jti: crypto.randomUUID()
        }, privateKey, {
            algorithm: "RS256",
            expiresIn: application.accessTokenTtl || "15m"
        });

        const { token: newRefreshToken, jti: newJti } = generateRefreshToken();
        const newHashed = hashToken(newRefreshToken);

        const refreshTtl = application.refreshTokenTtl || 604800;

        await sessionRepo.create({
            id: newJti,
            userId: user.id,
            applicationId: application.id,
            refreshTokenHash: newHashed,
            tokenVersion: user.tokenVersion,
            expiresAt: calculateExpiration(refreshTtl),
            revoked: false
        });

        await redis.set(
            `refresh:${newJti}`,
            JSON.stringify({
                userId: user.id,
                applicationId: application.id,
                tokenVersion: user.tokenVersion
            }),
            "EX",
            refreshTtl
        );

        return {
            access_token: newAccessToken,
            refresh_token: newRefreshToken
        };
    }
}
