// Vercel serverless version of /api/contact.
// Inserts into Turso when configured; otherwise logs and still accepts
// the message so the form never breaks (local dev stores to messages.jsonl).
import { getClient, ensureTables } from "./_lib/db.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, email, service, message } = req.body || {};
  const cleanName = String(name || "").trim().slice(0, 100);
  const cleanEmail = String(email || "").trim().slice(0, 150);
  const cleanService = String(service || "").trim().slice(0, 100);
  const cleanMessage = String(message || "").trim().slice(0, 5000);
  if (!cleanName || !cleanEmail || !cleanMessage) {
    return res.status(400).json({ error: "Please fill in your name, a valid email and a message." });
  }
  if (!EMAIL_RE.test(cleanEmail)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  const db = getClient();
  if (db) {
    try {
      await ensureTables(db);
      const stored = cleanService ? `[Service: ${cleanService}] ${cleanMessage}` : cleanMessage;
      await db.execute({
        sql: "INSERT INTO contact_messages (name, email, message, created_at, is_read) VALUES (?, ?, ?, ?, 0)",
        args: [cleanName, cleanEmail, stored, new Date().toISOString()],
      });
    } catch (err) {
      console.error("[contact] Turso save failed:", err);
      return res.status(500).json({ error: "Could not save your message. Please try again." });
    }
  } else {
    console.log("[contact]", { name: cleanName, email: cleanEmail, service: cleanService, message: cleanMessage });
  }
  res.status(200).json({ ok: true });
}
