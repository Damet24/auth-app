```bash
src/
├── app.js
├── config/
│    ├── jwt.js
│    └── redis.js
│
├── domain/
│    ├── entities/
│    │     ├── Users.js
│    │     ├── Tenant.js
│    │     └── Application.js
│    │
│    ├── repositories/
│    │     ├── UserRepository.js (interface)
│    │     └── TenantRepository.js
│    │
│    └── services/
│          ├── Service.js
│          └── TokenService.js
│
├── infrastructure/
│    ├── sqlite/
│    │     ├── SqliteUserRepository.js
│    │     └── db.js
│    │
│    ├── redis/
│    │     └── SessionStore.js
│    │
│    └── crypto/
│          └── KeyManager.js
│
├── api/
│    ├── routes/
│    │     ├── auth.routes.js
│    │     └── tenant.routes.js
│    │
│    └── middleware/
│          ├── authenticate.js
│          └── authorize.js
```
