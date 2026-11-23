// Vercel serverless version of /api/chat (same logic as server/index.js)
import { getReply } from "../server/llm.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { reply, provider } = await getReply(req.body?.messages);
    res.status(200).json({ reply, provider });
  } catch (e) {
    console.error("[chat] error:", e.message);
    res.status(500).json({ error: "The assistant is unavailable right now." });
  }
}
