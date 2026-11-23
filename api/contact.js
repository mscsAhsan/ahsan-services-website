import { getClient, ensureTables, jsonBody } from "./_lib/db.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const db = getClient();
  if (!db) {
    return res.status(503).json({ error: "DB_NOT_CONFIGURED" });
  }

  const body = jsonBody(req);
  const name = String(body.name || "").trim().slice(0, 100);
  const email = String(body.email || "").trim().slice(0, 150);
  const service = String(body.service || "").trim().slice(0, 100);
  const message = String(body.message || "").trim().slice(0, 5000);
  const storedMessage = service ? `[Service: ${service}] ${message}` : message;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required" });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    await ensureTables(db);
    await db.execute({
      sql: "INSERT INTO contact_messages (name, email, message, created_at, is_read) VALUES (?, ?, ?, ?, 0)",
      args: [name, email, storedMessage, new Date().toISOString()],
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact save failed:", err);
    return res.status(500).json({ error: "DB_ERROR" });
  }
}
