import {createDb} from "../../Config/Db.js";
import {SqliteTenantRepository} from "../../Infrastructure/Sqlite/SqliteTenantRepository.js";
import {SqliteApplicationRepository} from "../../Infrastructure/Sqlite/SqliteApplicationRepository.js";
import {SqliteCredentialsRepository} from "../../Infrastructure/Sqlite/SqliteCredentialsRepository.js";
import {SqliteRoleRepository} from "../../Infrastructure/Sqlite/SqliteRoleRepository.js";
import {SqlitePermissionRepository} from "../../Infrastructure/Sqlite/SqlitePermissionRepository.js";
import {SqliteSessionRepository} from "../../Infrastructure/Sqlite/SqliteSessionRepository.js";
import {SqliteUserRepository} from "../../Infrastructure/Sqlite/SqliteUserRepository.js";


const db = await createDb();

export const tenantRepository = new SqliteTenantRepository(db);
export const applicationRepository = new SqliteApplicationRepository(db);
export const credentialsRepository = new SqliteCredentialsRepository(db);
export const roleRepository = new SqliteRoleRepository(db);
export const permissionRepository = new SqlitePermissionRepository(db);
export const sessionRepo = new SqliteSessionRepository(db);
export const userRepository = new SqliteUserRepository(db);
