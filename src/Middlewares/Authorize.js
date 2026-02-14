export function authorize(permission) {
  return async function (request, reply) {
    if (request.user.is_global_admin) {
      return;
    }

    const userPermissions = request.user.permissions || [];

    if (!userPermissions.includes(permission)) {
      return reply.code(403).send({ error: 'Forbidden' });
    }
  };
}
