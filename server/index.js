import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getReply } from "./llm.js";
import { getClient, ensureTables } from "../api/_lib/db.js";
import loginHandler from "../api/admin/login.js";
import messagesHandler from "../api/admin/messages.js";
import queriesHandler from "../api/admin/queries.js";
import statsHandler from "../api/admin/stats.js";

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

// Express req/res are compatible with the Vercel-style handlers in api/.
const adapt = (handler) => (req, res) => handler(req, res);

app.get("/api/health", (_req, res) =>
  res.json({
    ok: true,
    groq: Boolean(process.env.GROQ_API_KEY),
    cohere: Boolean(process.env.COHERE_API_KEY),
    turso: Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN),
    admin: Boolean(process.env.ADMIN_PASSWORD),
  })
);

app.post("/api/chat", rateLimit(20, 60_000), async (req, res) => {
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
    res.json({ reply, provider });
  } catch (e) {
    console.error("[chat] error:", e.message);
    res.status(500).json({ error: "The assistant is unavailable right now. Please try again or use the Contact page." });
  }
});

app.post("/api/contact", rateLimit(5, 60_000), async (req, res) => {
  const { name, email, service, message } = req.body || {};
  const ok = (v, max) => typeof v === "string" && v.trim().length > 0 && v.length <= max;
  if (!ok(name, 100) || !ok(email, 150) || !/^\S+@\S+\.\S+$/.test(email) || !ok(message, 3000)) {
    return res.status(400).json({ error: "Please fill in your name, a valid email and a message." });
  }
  const entry = { at: new Date().toISOString(), name, email, service: service || "", message };
  const db = getClient();
  if (db) {
    try {
      await ensureTables(db);
      const stored = entry.service ? `[Service: ${entry.service}] ${entry.message}` : entry.message;
      await db.execute({
        sql: "INSERT INTO contact_messages (name, email, message, created_at, is_read) VALUES (?, ?, ?, ?, 0)",
        args: [entry.name, entry.email, stored, entry.at],
      });
    } catch (err) {
      console.error("[contact] Turso save failed:", err);
      return res.status(500).json({ error: "Could not save your message. Please try again." });
    }
  } else {
    console.log("[contact] new message:", entry);
    fs.appendFile(path.join(__dirname, "messages.jsonl"), JSON.stringify(entry) + "\n", () => {});
  }
  res.json({ ok: true });
});

// ---- admin (same handlers as the Vercel functions) ----
app.post("/api/admin/login", rateLimit(10, 60_000), adapt(loginHandler));
app.get("/api/admin/messages", adapt(messagesHandler));
app.patch("/api/admin/messages", adapt(messagesHandler));
app.delete("/api/admin/messages", adapt(messagesHandler));
app.get("/api/admin/queries", adapt(queriesHandler));
app.delete("/api/admin/queries", adapt(queriesHandler));
app.get("/api/admin/stats", adapt(statsHandler));

// ---- serve the built site in production ----
const dist = path.join(__dirname, "..", "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => console.log(`API ready on http://localhost:${PORT}  (Groq: ${!!process.env.GROQ_API_KEY}, Cohere: ${!!process.env.COHERE_API_KEY}, Turso: ${!!getClient()}, Admin: ${!!process.env.ADMIN_PASSWORD})`));
