import dotenv from "dotenv";
dotenv.config();

export const env = {
    port: process.env.PORT || 3000,
    sqlitePath: process.env.SQLITE_PATH,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    privateKeyPath: process.env.JWT_PRIVATE_KEY_PATH,
    publicKeyPath: process.env.JWT_PUBLIC_KEY_PATH,
    defaultAccessTtl: parseInt(process.env.ACCESS_TOKEN_DEFAULT_TTL),
    defaultRefreshTtl: parseInt(process.env.REFRESH_TOKEN_DEFAULT_TTL)
};
