import { AppError } from "./AppError.js";

export class InvalidCredentialsError extends AppError {
    constructor() {
        super("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }
}

export class InvalidClientError extends AppError {
    constructor() {
        super("Invalid client", 401, "INVALID_CLIENT");
    }
}

export class TenantInactiveError extends AppError {
    constructor() {
        super("Tenant inactive", 403, "TENANT_INACTIVE");
    }
}

export class InvalidRefreshTokenError extends AppError {
    constructor() {
        super("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
    }
}

export class TokenExpiredError extends AppError {
    constructor() {
        super("Refresh token expired", 401, "TOKEN_EXPIRED");
    }
}

export class TokenInvalidatedError extends AppError {
    constructor() {
        super("Token invalidated", 401, "TOKEN_INVALIDATED");
    }
}
