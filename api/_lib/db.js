import { createClient } from "@libsql/client";

let client = null;

export function getClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) return null;
  if (!client) {
    client = createClient({ url, authToken });
  }
  return client;
}

export async function ensureTables(db) {
  await db.execute(
    "CREATE TABLE IF NOT EXISTS contact_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL, is_read INTEGER NOT NULL DEFAULT 0)"
  );
  await db.execute(
    "CREATE TABLE IF NOT EXISTS chat_queries (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT NOT NULL, answer TEXT NOT NULL, created_at TEXT NOT NULL)"
  );
}

export function jsonBody(req) {
  const body = req.body;
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}
