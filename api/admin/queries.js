import { getClient, ensureTables } from "../_lib/db.js";
import { verifyToken, bearerToken } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (!verifyToken(bearerToken(req))) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  const db = getClient();
  if (!db) {
    return res.status(503).json({ error: "DB_NOT_CONFIGURED" });
  }

  if (req.method === "GET") {
    try {
      await ensureTables(db);
      const result = await db.execute({
        sql: "SELECT id, question, answer, created_at FROM chat_queries ORDER BY created_at DESC LIMIT 200",
        args: [],
      });
      return res.status(200).json({ queries: result.rows });
    } catch (err) {
      console.error("Queries list failed:", err);
      return res.status(500).json({ error: "DB_ERROR" });
    }
  }

  if (req.method === "DELETE") {
    const id = Number(req.query && req.query.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid id" });
    }
    try {
      await ensureTables(db);
      await db.execute({
        sql: "DELETE FROM chat_queries WHERE id = ?",
        args: [id],
      });
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Queries delete failed:", err);
      return res.status(500).json({ error: "DB_ERROR" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
