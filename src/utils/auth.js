import { PERMISSIONS } from '../Modules/Auth/Permissions.js';

export function getAllPermissions() {
  return Object.values(PERMISSIONS).flatMap((group) => Object.values(group));
}
