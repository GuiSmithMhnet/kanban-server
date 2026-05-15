import pg from "pg";

import { env } from "./env.js";

const { Pool } = pg;

export const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
});

pool.on("error", (error) => {
  console.error("[db] erro inesperado no pool:", error.message);
});

export async function query(text, params) {
  return pool.query(text, params);
}

export async function testDatabaseConnection() {
  const client = await pool.connect();

  try {
    await client.query("SELECT 1");
    console.log("[db] conexao com kanban-db validada.");
  } finally {
    client.release();
  }
}
