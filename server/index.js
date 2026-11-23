import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getReply } from "./llm.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors());
app.use(express.json({ limit: "20kb" }));

// ---- tiny in-memory rate limiter (per IP) ----
const hits = new Map();
function rateLimit(max, windowMs) {
  return (req, res, next) => {
    const key = req.ip + req.path;
    const now = Date.now();
    const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (arr.length >= max) return res.status(429).json({ error: "Too many requests, please slow down." });
    arr.push(now);
    hits.set(key, arr);
    next();
  };
}

app.get("/api/health", (_req, res) =>
  res.json({
    ok: true,
    groq: Boolean(process.env.GROQ_API_KEY),
    cohere: Boolean(process.env.COHERE_API_KEY),
  })
);

app.post("/api/chat", rateLimit(20, 60_000), async (req, res) => {
  try {
    const { reply, provider } = await getReply(req.body?.messages);
    res.json({ reply, provider });
  } catch (e) {
    console.error("[chat] error:", e.message);
    res.status(500).json({ error: "The assistant is unavailable right now. Please try again or use the Contact page." });
  }
});

app.post("/api/contact", rateLimit(5, 60_000), (req, res) => {
  const { name, email, service, message } = req.body || {};
  const ok = (v, max) => typeof v === "string" && v.trim().length > 0 && v.length <= max;
  if (!ok(name, 100) || !ok(email, 150) || !/^\S+@\S+\.\S+$/.test(email) || !ok(message, 3000)) {
    return res.status(400).json({ error: "Please fill in your name, a valid email and a message." });
  }
  const entry = { at: new Date().toISOString(), name, email, service: service || "", message };
  console.log("[contact] new message:", entry);
  fs.appendFile(path.join(__dirname, "messages.jsonl"), JSON.stringify(entry) + "\n", () => {});
  res.json({ ok: true });
});

// ---- serve the built site in production ----
const dist = path.join(__dirname, "..", "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => console.log(`API ready on http://localhost:${PORT}  (Groq: ${!!process.env.GROQ_API_KEY}, Cohere: ${!!process.env.COHERE_API_KEY})`));
