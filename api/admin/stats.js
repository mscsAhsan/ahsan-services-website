import { getClient, ensureTables } from "../_lib/db.js";
import { verifyToken, bearerToken } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!verifyToken(bearerToken(req))) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  const db = getClient();
  if (!db) {
    return res.status(503).json({ error: "DB_NOT_CONFIGURED" });
  }

  try {
    await ensureTables(db);
    const today = new Date().toISOString().slice(0, 10) + "T00:00:00.000Z";
    const [messages, unread, queries, todayQueries] = await Promise.all([
      db.execute("SELECT COUNT(*) AS n FROM contact_messages"),
      db.execute("SELECT COUNT(*) AS n FROM contact_messages WHERE is_read = 0"),
      db.execute("SELECT COUNT(*) AS n FROM chat_queries"),
      db.execute({
        sql: "SELECT COUNT(*) AS n FROM chat_queries WHERE created_at >= ?",
        args: [today],
      }),
    ]);
    return res.status(200).json({
      messages: Number(messages.rows[0].n),
      unreadMessages: Number(unread.rows[0].n),
      queries: Number(queries.rows[0].n),
      queriesToday: Number(todayQueries.rows[0].n),
    });
  } catch (err) {
    console.error("Stats failed:", err);
    return res.status(500).json({ error: "DB_ERROR" });
  }
}
