import { testDatabaseConnection } from "./config/db.js";
import { validateStartupEnv } from "./config/env.js";
import { startEmailConsumer } from "./consumers/emailConsumer.js";
import { startJobs } from "./jobs/index.js";

async function bootstrap() {
  console.log("[startup] iniciando kanban-server...");

  validateStartupEnv();
  await testDatabaseConnection();
  startJobs();
  await startEmailConsumer();

  console.log("[startup] worker de e-mail iniciado.");
}

bootstrap().catch((error) => {
  console.error("[startup] erro fatal na inicializacao:", error.message);
  process.exit(1);
});
