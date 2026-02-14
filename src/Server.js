import { buildApp } from './App.js';
import { env } from './config/Env.js';

const app = buildApp();

app.listen({ port: env.port }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on port ${env.port}`);
});
