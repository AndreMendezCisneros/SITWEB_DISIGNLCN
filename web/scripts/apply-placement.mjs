/**
 * Aplica solo la migración de banners.placement
 * Uso: node --env-file=.env.local scripts/apply-placement.mjs
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
    "Falta DIRECT_URL en .env.local. Mientras tanto, ejecuta el SQL de supabase/migrations/20260802150000_banners_placement.sql en el SQL Editor de Supabase."
  );
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

const migration = fs.readFileSync(
  path.join(root, "supabase/migrations/20260802150000_banners_placement.sql"),
  "utf8"
);

await client.connect();
try {
  await client.query(migration);
  console.log("OK: banners.placement aplicada");
} catch (e) {
  console.error("Error SQL:", e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
