import { PERMISSIONS } from '../Domain/Constants/Permissions.js';

export function getAllPermissions() {
  return Object.values(PERMISSIONS).flatMap((group) => Object.values(group));
}
