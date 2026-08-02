/**
 * Aplica migration + seed usando DIRECT_URL de .env.local
 * Uso: node scripts/apply-db.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnv() {
  const raw = fs.readFileSync(path.join(root, ".env.local"), "utf8");
  return Object.fromEntries(
    raw
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith("#") && l.includes("="))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
      })
  );
}

const env = loadEnv();
const url = env.DIRECT_URL || env.DATABASE_URL;
if (!url || url.includes("YOUR_DB_PASSWORD") || url.includes("[YOUR-PASSWORD]")) {
  console.error(
    "Falta la contraseña real en DIRECT_URL dentro de .env.local (reemplaza YOUR_DB_PASSWORD)."
  );
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
console.log("Conectado a Postgres");

const migration = fs.readFileSync(
  path.join(root, "supabase/migrations/20260802120000_init_lcs.sql"),
  "utf8"
);
const seed = fs.readFileSync(path.join(root, "supabase/seed.sql"), "utf8");

try {
  await client.query(migration);
  console.log("Migración aplicada");
  await client.query(seed);
  console.log("Seed aplicado");
} catch (e) {
  console.error("Error SQL:", e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
