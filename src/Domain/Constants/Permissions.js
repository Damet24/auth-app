export const PERMISSIONS = Object.freeze({
  USER: Object.freeze({
    CREATE: 'user:create',
    READ: 'user:read',
    UPDATE: 'user:update',
    DELETE: 'user:delete',
  }),

  TENANT: Object.freeze({
    CREATE: 'tenant:create',
    READ: 'tenant:read',
    UPDATE: 'tenant:update',
    DELETE: 'tenant:delete',
  }),

  APPLICATION: Object.freeze({
    CREATE: 'application:create',
    READ: 'application:read',
    UPDATE: 'application:update',
    DELETE: 'application:delete',
  }),

  ROLE: Object.freeze({
    CREATE: 'role:create',
    READ: 'role:read',
    UPDATE: 'role:update',
    DELETE: 'role:delete',
  }),
});
