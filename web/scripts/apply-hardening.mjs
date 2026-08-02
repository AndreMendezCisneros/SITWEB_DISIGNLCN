/**
 * Aplica migraciones de hardening (placement + auth + índices + RPCs).
 * Uso: node scripts/apply-hardening.mjs
 * Requiere DIRECT_URL en .env.local
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
    "Falta DIRECT_URL en .env.local.\n" +
      "1) Supabase → Project Settings → Database → Connection string (URI)\n" +
      "2) Pégala como DIRECT_URL=...\n" +
      "3) O ejecuta en SQL Editor el archivo:\n" +
      "   supabase/migrations/20260802160000_prod_hardening.sql"
  );
  process.exit(1);
}

const files = [
  "20260802150000_banners_placement.sql",
  "20260802160000_prod_hardening.sql",
];

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
try {
  for (const file of files) {
    const sql = fs.readFileSync(
      path.join(root, "supabase/migrations", file),
      "utf8"
    );
    await client.query(sql);
    console.log("OK:", file);
  }
} catch (e) {
  console.error("Error SQL:", e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
