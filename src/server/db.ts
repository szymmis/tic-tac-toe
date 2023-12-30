import { dirname, join } from "path";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";

const db = await open({ filename: "data.db", driver: sqlite3.Database });

await db.migrate({
  migrationsPath: join(dirname(fileURLToPath(import.meta.url)), "migrations"),
});

export default db;
