// Vercel serverless version of /api/chat (same logic as server/index.js).
// Logs each answered question to Turso when configured; logging never
// breaks the chat response.
import { getReply } from "../server/llm.js";
import { getClient, ensureTables } from "./_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { reply, provider } = await getReply(req.body?.messages);
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const lastUser = [...messages].reverse().find((m) => m && m.role === "user" && typeof m.content === "string");
    if (lastUser) {
      try {
        const db = getClient();
        if (db) {
          await ensureTables(db);
          await db.execute({
            sql: "INSERT INTO chat_queries (question, answer, created_at) VALUES (?, ?, ?)",
            args: [lastUser.content.slice(0, 2000), reply, new Date().toISOString()],
          });
        }
      } catch (err) {
        console.error("[chat] log failed:", err);
      }
    }
    res.status(200).json({ reply, provider });
  } catch (e) {
    console.error("[chat] error:", e.message);
    res.status(500).json({ error: "The assistant is unavailable right now." });
  }
}
