```bash
src/
├── app.js
├── config/
# Auth Server
```
Minimal authentication/authorization server built with Fastify and SQLite.

## Requisitos

- Node.js 18+ (o versión compatible)
- npm

## Instalación

1. Clona el repositorio

2. Instala dependencias:

```bash
npm install
```

3. Configura variables de entorno creando un archivo `.env` en la raíz. Variables clave:

- `PORT` (opcional) — puerto del servidor, por defecto `3000`
- `SQLITE_PATH` — ruta al archivo SQLite (ej: `./database/sqlite/dev.db`)
- `REDIS_HOST` — host de Redis (opcional)
- `REDIS_PORT` — puerto de Redis (opcional)
- `JWT_PRIVATE_KEY_PATH` — ruta a clave privada para JWT
- `JWT_PUBLIC_KEY_PATH` — ruta a clave pública para JWT
- `ACCESS_TOKEN_DEFAULT_TTL` — tiempo (segundos) de expiración de access token
- `REFRESH_TOKEN_DEFAULT_TTL` — tiempo (segundos) de expiración de refresh token

Ejemplo `.env`:

```env
PORT=3000
SQLITE_PATH=./database/sqlite/dev.db
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JWT_PRIVATE_KEY_PATH=./keys/private.pem
JWT_PUBLIC_KEY_PATH=./keys/public.pem
ACCESS_TOKEN_DEFAULT_TTL=900
REFRESH_TOKEN_DEFAULT_TTL=604800
```

## Inicializar la base de datos SQLite

Hay un script en `database/sqlite/init.js` y el esquema `database/sqlite/sqlite.sql` para crear las tablas necesarias. Ejecuta el script para crear la base:

```bash
node database/sqlite/init.js
```

## Ejecutar

Modo desarrollo (con recarga en cambios):

```bash
npm run dev
```

Producción:

```bash
npm start
```

## Estructura principal

- `src/` — aplicación
	- `App.js` — crea y configura Fastify
	- `Server.js` — arranque del servidor
	- `Config/` — configuración y env
	- `Domain/` — entidades, repositorios y errores de dominio
	- `Infrastructure/` — adaptadores (SQLite, Redis, Crypto)
	- `Modules/` — módulos por recurso (Users, Auth, Credentials, Roles...)

## Endpoints relevantes

- `POST /auth/login` — inicio de sesión
- `POST /credentials` — registrar un usuario con credencial local (email, password, tenant_id)
- `PATCH /credentials/:id/password` — cambiar contraseña (autenticado)
- `POST /users` — crear usuario (requiere permiso)

Nota: la lista completa de rutas está en `src/Modules/*/Routes.js`.

## Tests

No hay tests incluidos actualmente.

## Contribuciones

Si deseas contribuir, por favor abre un issue o PR explicando los cambios.

---
Actualizado automáticamente para reflejar la estructura del proyecto.
