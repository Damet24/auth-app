import crypto from "node:crypto";
import {v4 as uuidv4} from "uuid";

export function generateRefreshToken() {
    const jti = uuidv4();
    const secret = crypto.randomBytes(32).toString("hex");

    const token = Buffer.from(`${jti}.${secret}`).toString("base64");

    return {token, jti};
}

export function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}
