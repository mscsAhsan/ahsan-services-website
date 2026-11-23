import { getClient, ensureTables, jsonBody } from "../_lib/db.js";
import { verifyToken, bearerToken } from "../_lib/auth.js";

function unauthorized(res) {
  return res.status(401).json({ error: "UNAUTHORIZED" });
}

function parseId(req) {
  const raw = req.query && req.query.id;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export default async function handler(req, res) {
  if (!verifyToken(bearerToken(req))) {
    return unauthorized(res);
  }

  const db = getClient();
  if (!db) {
    return res.status(503).json({ error: "DB_NOT_CONFIGURED" });
  }

  if (req.method === "GET") {
    try {
      await ensureTables(db);
      const unreadOnly = req.query && req.query.unread_only === "1";
      const result = await db.execute({
        sql: unreadOnly
          ? "SELECT id, name, email, message, created_at, is_read FROM contact_messages WHERE is_read = 0 ORDER BY created_at DESC LIMIT 200"
          : "SELECT id, name, email, message, created_at, is_read FROM contact_messages ORDER BY created_at DESC LIMIT 200",
        args: [],
      });
      return res.status(200).json({ messages: result.rows });
    } catch (err) {
      console.error("Messages list failed:", err);
      return res.status(500).json({ error: "DB_ERROR" });
    }
  }

  if (req.method === "PATCH") {
    const id = parseId(req);
    if (id === null) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const body = jsonBody(req);
    const isRead = body.is_read ? 1 : 0;
    try {
      await ensureTables(db);
      await db.execute({
        sql: "UPDATE contact_messages SET is_read = ? WHERE id = ?",
        args: [isRead, id],
      });
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Messages update failed:", err);
      return res.status(500).json({ error: "DB_ERROR" });
    }
  }

  if (req.method === "DELETE") {
    const id = parseId(req);
    if (id === null) {
      return res.status(400).json({ error: "Invalid id" });
    }
    try {
      await ensureTables(db);
      await db.execute({
        sql: "DELETE FROM contact_messages WHERE id = ?",
        args: [id],
      });
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Messages delete failed:", err);
      return res.status(500).json({ error: "DB_ERROR" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
