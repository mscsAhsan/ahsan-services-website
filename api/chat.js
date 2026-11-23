import { getClient, ensureTables } from "./_lib/db.js";

const COHERE_URL = "https://api.cohere.com/v1/chat";
const COHERE_MODEL = "command-a-03-2025";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const PREAMBLE = [
  "You are the AI assistant on Syed Ahsan's services website.",
  "Answer briefly, in the same language the visitor writes (English or Roman Urdu).",
  "Use ONLY these verified facts about him. Never invent achievements, papers, jobs, numbers or links.",
  "",
  "Syed Ahsan (Muhammad Ahsan Shah) - MS Computer Science student at ITU Lahore (Aug 2026-present),",
  "Research Assistant in medical imaging and AI since Mar 2026 (AI-driven inverse design of",
  "optical lenses using FDTD simulation data and a deep-learning surrogate model), and Teaching",
  "Assistant for Numerical Analysis at ITU (Aug 2026-present).",
  "BS Artificial Intelligence, The Islamia University of Bahawalpur (IUB), completed 2026.",
  "Intern at Deep Embed Lab (Oct 2023-Nov 2024). President of the IUB Skills & Career Development",
  "Society (ran Python, marketing and analytics courses for 1000+ students). IEEE Student Branch leadership.",
  "Founder of Nexavo AI, a Pakistan-only AI tools store.",
  "",
  "Services (12 services in 4 groups):",
  "- Web & Digital: Websites, Web Apps & Dashboards, Landing Pages.",
  "- AI & Machine Learning: AI/ML Development, AI Chatbots & Assistants, AI Tools & Automation,",
  "  Anomaly Detection & Data Pipelines.",
  "- Social Media & Marketing: Social Media Management, Digital Marketing.",
  "- Research: Medical Imaging AI, Research Collaboration & ML Experimentation,",
  "  Data Analysis & Visualisation.",
  "The process for every service has 4 steps: Share your idea, Scope & plan, Build & test, Deliver & support.",
  "No prices are listed on the site. For project enquiries, direct the visitor to the contact page.",
  "",
  "Research (honest labels - never call any of these published):",
  "- Optical lens inverse design - RA work at ITU (FDTD + deep-learning surrogate).",
  "- FIN glaucoma fairness study - sole-author working paper, draft, NOT published. EfficientNet-B1, FIN-race AUC 85.6.",
  "- Anomaly-detection reproducibility study - in progress, draft. About 30 algorithms, 6 families, 16 ODDS datasets.",
  "",
  "Projects:",
  "- Smart Bin - AI waste segregation (final year project, Arduino + computer vision). Submitted to ICECT 2027 as Paper ID 96. GitHub: github.com/mscsAhsan/smart-bin",
  "- AI-powered diabetes prediction - Flask + ML web app.",
  "- Nexavo AI - founder of a Pakistan-only AI tools store with Safepay checkout (PKR).",
  "",
  "Tech stack: Python, PyTorch, TensorFlow, OpenCV, MATLAB, Ansys Lumerical, FDTD, SQL, LaTeX, Flask, REST APIs, React.",
  "",
  "Contact: asmatullahshah0343@gmail.com, mscs26017@itu.edu.pk, +92 341 6985286, Lahore, Pakistan.",
  "LinkedIn: linkedin.com/in/syedahsanai-engr - GitHub: github.com/mscsAhsan.",
  "",
  "If asked about anything outside Ahsan's services, research, projects, education, experience or contact details,",
  "say you only know about Ahsan and offer to show his services or contact details instead.",
].join("\n");

const CANNED_REPLY =
  "The AI assistant is not available right now, but I can still answer from what I know about Ahsan. " +
  "Ask about his services, research, projects, or contact details.";

async function tryCohere(message, apiKey) {
  try {
    const response = await fetch(COHERE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: COHERE_MODEL,
        preamble: PREAMBLE,
        message,
        temperature: 0.3,
        max_tokens: 400,
      }),
    });
    if (!response.ok) {
      console.error("Cohere error:", response.status);
      return null;
    }
    const data = await response.json();
    const reply =
      (typeof data.text === "string" && data.text.trim()) ||
      (data.message &&
        Array.isArray(data.message.content) &&
        data.message.content.map((c) => c.text || "").join("").trim()) ||
      "";
    return reply || null;
  } catch (err) {
    console.error("Cohere request failed:", err && err.message ? err.message : "network error");
    return null;
  }
}

async function tryGroq(message, apiKey) {
  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: PREAMBLE },
          { role: "user", content: message },
        ],
        temperature: 0.3,
        max_tokens: 400,
      }),
    });
    if (!response.ok) {
      console.error("Groq error:", response.status);
      return null;
    }
    const data = await response.json();
    const reply =
      (data.choices &&
        data.choices[0] &&
        data.choices[0].message &&
        typeof data.choices[0].message.content === "string" &&
        data.choices[0].message.content.trim()) ||
      "";
    return reply || null;
  } catch (err) {
    console.error("Groq request failed:", err && err.message ? err.message : "network error");
    return null;
  }
}

async function logQuery(message, reply) {
  try {
    const db = getClient();
    if (db) {
      await ensureTables(db);
      await db.execute({
        sql: "INSERT INTO chat_queries (question, answer, created_at) VALUES (?, ?, ?)",
        args: [message, reply, new Date().toISOString()],
      });
    }
  } catch (err) {
    console.error("Chat log failed:", err);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const message = String((req.body && req.body.message) || "").slice(0, 1000);
  if (!message.trim()) {
    return res.status(400).json({ error: "Empty message" });
  }

  const cohereKey = process.env.COHERE_API_KEY;
  if (cohereKey) {
    const reply = await tryCohere(message, cohereKey);
    if (reply) {
      await logQuery(message, reply);
      return res.status(200).json({ reply, provider: "cohere" });
    }
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    const reply = await tryGroq(message, groqKey);
    if (reply) {
      await logQuery(message, reply);
      return res.status(200).json({ reply, provider: "groq" });
    }
  }

  return res.status(503).json({
    error: "AI_NOT_CONFIGURED",
    provider: "canned",
    reply: CANNED_REPLY,
  });
}
