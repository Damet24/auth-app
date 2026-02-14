import fs from "fs";
import { env } from "./env.js";

export const privateKey = fs.readFileSync(env.privateKeyPath);
export const publicKey = fs.readFileSync(env.publicKeyPath);
