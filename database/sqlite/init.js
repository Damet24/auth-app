import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "../database.sqlite");
const SQL_PATH = path.join(__dirname, "./sqlite.sql");

async function init() {
    const db = await open({
        filename: DB_PATH,
        driver: sqlite3.Database
    });

    const schema = fs.readFileSync(SQL_PATH, "utf-8");
    await db.exec(schema);

    // 🔥 PLATFORM TENANT
    const platformTenantId = uuidv4();
    const dashboardAppId = uuidv4();
    const globalAdminId = uuidv4();
    const globalAdminId2 = uuidv4();

    const adminEmail = "admin@platform.dev";
    const adminEmail2 = "admin2@platform.dev";
    const adminPassword = "Admin123!";

    const clientId = "dashboard-app";
    const clientSecret = crypto.randomBytes(32).toString("hex");
    const clientSecretHash = await bcrypt.hash(clientSecret, 10);
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    console.log("Seeding platform tenant...");

    // Tenant platform
    await db.run(
        `INSERT INTO tenants (id, name, active)
     VALUES (?, ?, 1)`,
        [platformTenantId, "platform"]
    );

    // Dashboard application
    await db.run(
        `INSERT INTO applications (
            id,
            tenant_id,
            name,
            client_id,
            active,
            client_secret_hash
        ) VALUES (?, ?, ?, ?, 1, ?)`,
        [dashboardAppId, platformTenantId, "Dashboard", clientId, clientSecretHash]
    );

    // Global admin user
    await db.run(
        `INSERT INTO users (
            id,
            tenant_id,
            email,
            email_verified,
            active,
            is_global_admin
        ) VALUES (?, ?, ?, 1, 1, 1)`,
        [globalAdminId, platformTenantId, adminEmail]
    );

    await db.run(
        `INSERT INTO users (
            id,
            tenant_id,
            email,
            email_verified,
            active,
            is_global_admin
        ) VALUES (?, ?, ?, 1, 1, 1)`,
        [globalAdminId2, platformTenantId, adminEmail2]
    );

    // Credentials
    await db.run(
        `INSERT INTO user_credentials (
        id,
        user_id,
        provider,
        password_hash
     ) VALUES (?, ?, 'local', ?)`,
        [uuidv4(), globalAdminId, passwordHash]
    );

    console.log("=================================");
    console.log("✅ Platform initialized");
    console.log("=================================");
    console.log("Client ID:", clientId);
    console.log("Client Secret:", clientSecret);
    console.log("Admin Email:", adminEmail);
    console.log("Admin Password:", adminPassword);
    console.log("=================================");
}

init().catch(console.error);
