# Ahsan Services - Premium Red/Dark Services Website (Vite + React)

AI & Web Engineering · Websites · Web Apps & Dashboards · AI Chatbots & Assistants · AI/ML · AI Tools & Automation

Features: custom cursor, staggered page transitions, preloader, animated icons & orbit hero,
interactive neural-network canvas, 3D tilt cards, count-up stats, **AI chatbot (Groq + Cohere fallback)**
and a working contact form.

## 1. Run it locally
```bash
npm install
cp .env.example .env        # Windows: copy .env.example .env
# open .env and paste your keys:
#   GROQ_API_KEY=...
#   COHERE_API_KEY=...
npm run dev
```
Open http://localhost:5173  (Vite) - the API runs on http://localhost:8787 and is proxied automatically.

Check the keys are loaded: http://localhost:8787/api/health  ->  `{"ok":true,"groq":true,"cohere":true}`

## 2. Make it yours
| What | File |
|---|---|
| Brand name, email, WhatsApp, socials | `src/config.js` |
| Services, stats, packages | `src/data.js` |
| About page story | `src/pages/About.jsx` |
| Chatbot personality & knowledge | `SYSTEM_PROMPT` in `server/llm.js` |
| Colors | CSS variables at the top of `src/index.css` |
| Title / SEO tags | `index.html` |

## 3. How the chatbot works
Browser -> `POST /api/chat` -> your server -> **Groq** (primary) -> if it fails -> **Cohere** (fallback).
Keys live only in `.env` on the server, never in the React code. Never commit `.env`.
Models can be changed with `GROQ_MODEL` / `COHERE_MODEL` in `.env`. Defaults: Groq `llama-3.3-70b-versatile`, Cohere `command-a-03-2025` (the live Cohere chat model).

## 4. Production build
```bash
npm run build
npm start        # serves dist/ + the API from one Node process (PORT in .env)
```
Deploy to Render / Railway / any VPS: build command `npm install && npm run build`, start command `npm start`,
and add `GROQ_API_KEY` + `COHERE_API_KEY` in the host's environment variables.

### Vercel
Import the repo; Vercel uses `api/chat.js` and `api/contact.js` as serverless functions and `vercel.json`
for SPA routing. Add the two keys under Project Settings -> Environment Variables.

## 5. Contact form
Messages are saved to Turso (when configured) or to `server/messages.jsonl` (Node host) or Vercel function logs. To receive them by email,
forward the `entry` object to Resend, Formspree or EmailJS inside `server/index.js` / `api/contact.js`.

## 6. Admin dashboard (/admin)
The dashboard shows contact messages and chatbot questions, with search, read/unread, delete and stats. It is not in the main nav; a small "Admin" link sits in the footer bottom.
1. Create a free database at turso.tech and copy its URL and auth token.
2. Set these environment variables (locally in `.env`, on Vercel under Project Settings -> Environment Variables, all environments):
   `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `ADMIN_PASSWORD` (pick a strong password).
   Optional: `ADMIN_SESSION_SECRET` (separate secret for signing session tokens; if empty, `ADMIN_PASSWORD` is used).
3. Redeploy (Vercel) or restart `npm run dev` (local), then open `/admin` and sign in with the admin password.
Sessions last 7 days. Without `ADMIN_PASSWORD` the login page shows setup steps; without Turso the dashboard shows a "database not connected" note. The contact form keeps working either way.

## Project structure
```
server/   Express API + Groq/Cohere logic
api/      Vercel serverless versions of the same endpoints
src/components/  Cursor, PageWrap (transitions), Preloader, Chatbot, OrbitVisual, NeuralBackground, ...
src/pages/       Home, Services, About, Contact, ServiceDetail, AdminPage, NotFound
api/admin/       Admin login, messages, queries and stats endpoints (Turso + HMAC sessions)
api/_lib/        Turso client and session-token helpers
prompts/website-prompt.json   The full JSON design/build prompt for this site
```
