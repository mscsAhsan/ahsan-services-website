# Ahsan Services - AI, Web & Research Services

Services website of Muhammad Ahsan Shah (Syed Ahsan), MS Computer Science student and
Research Assistant at ITU Lahore. A standalone red-themed site offering his 12 services
in 4 groups, each with its own full detail page.

Live pages: Home, Services, Service detail pages, Process, Contact, and the admin
dashboard at `/admin` (linked discreetly in the footer).

## Pages

- `/` - Home: animated hero with red particle field, photo, animated stat counters,
  featured services preview, 4-step process preview, why-work-with-me strip, marquee
  strip, and contact call-to-action bands.
- `/services` - All 12 services in 4 groups (Web & Digital, AI & Machine Learning,
  Social Media & Marketing, Research), with a process section, a stats strip and a
  contact call-to-action. No prices listed.
- `/services/:slug` - One detail page per service, rendered from `src/data/services.ts`:
  overview, what is included (deliverables), how it works (service-specific process
  steps), tools and technologies, FAQs, related services, and a "Start this project"
  button that opens the contact form with the service preselected.
  Slugs: websites, web-apps-dashboards, landing-pages, ai-ml-development,
  ai-chatbots-assistants, ai-tools-automation, anomaly-detection-data-pipelines,
  social-media-management, digital-marketing, medical-imaging-ai,
  research-collaboration-ml-experimentation, data-analysis-visualisation.
- `/process` - Full How-it-works page: the 4 steps expanded with detail, a timeline
  visual, what happens at each stage, and a call-to-action.
- `/contact` - Contact form (saves the message to the Turso database, falls back
  to your mail app when the database is not configured) with a service dropdown
  preselected from the `?service=` URL parameter, plus email, phone, Lahore,
  LinkedIn, GitHub.
- `/admin` - Admin dashboard (not in the main nav, linked in the footer). Sign in
  with the admin password to see contact messages and chatbot queries, with stats,
  search, read/unread marking and delete. See "Database & Admin" below.

## Tech stack

- React 18 + TypeScript + Vite
- Tailwind CSS (premium dark + red theme: charcoal base `#0F0F11` / `#17171A`,
  crimson red `#DC2626` / `#E11D48`, light warm-grey `#F5F3F0` sections for contrast,
  Space Grotesk + Inter + JetBrains Mono)
- Content reveals use CSS + IntersectionObserver; GSAP only for transform-only effects:
  parallax, tilt, magnetic buttons, counters
- React Router for the multi-page structure
- Vercel serverless functions (`api/chat.js`, `api/contact.js`) for the chatbot and
  the contact form

## Visuals

- Premium visual layer (pure CSS/SVG/canvas, no external images): red aurora
  mesh-gradient hero with a lightweight canvas particle field in red hues (~40
  particles, desktop only, pauses when the tab is hidden), conic gradient ring and
  glow behind the photo, floating glass stat chips, a fixed ultra-subtle film-grain
  overlay (~0.03 opacity), ambient red gradient orbs behind every page, gradient
  hairline dividers, and glass cards with gradient top borders and gradient frames.
- Page transitions: the new page fades and rises slightly on route change, plus a
  thin red gradient sweep bar under the nav. No full-screen overlays, so the transition
  works the same on mobile and desktop.
- Custom mouse cursor (desktop, fine pointer only): a red dot that follows instantly
  plus a trailing red ring with smooth lerp. It expands over links, buttons and cards.
  `cursor: none` is only applied by JS, so if JS fails the native cursor stays; touch
  devices are untouched. Reduced-motion users get instant follow with no lag.
- Marquee strip, animated gradient borders, and animated stat counters (transform and
  opacity only, no layout shift, no horizontal overflow).

## Run locally

```bash
npm install
npm run dev      # local development server
npm run build    # production build (outputs to dist/)
npm run preview  # preview the production build
```

## Deploy on Vercel

Import the repository as a **Vercel standalone Vite app** (not a multi-service project):
Root Directory `./`, Framework Preset `Vite`. The `vercel.json` at the repo root
rewrites every route except `/api/*` to `index.html`, so `/services`, `/process` and
the other pages work on refresh and direct visits.

**Environment variables** (Vercel - Project Settings - Environment Variables,
then redeploy):

- `COHERE_API_KEY` - for the chatbot, first provider (see "Chatbot" below).
- `GROQ_API_KEY` - for the chatbot, fallback provider when Cohere is not configured
  or its call fails (see "Chatbot" below).
- `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` - set automatically by the Turso
  Vercel integration (Storage - Create Database - Turso). For local testing,
  create them with the Turso CLI (`turso db create`, `turso db tokens create`).
- `ADMIN_PASSWORD` - the admin dashboard password. Pick a strong password and
  keep it private. Optional: `ADMIN_SESSION_SECRET` signs the login session
  tokens; if it is empty, `ADMIN_PASSWORD` is used for signing instead.

## Chatbot (Cohere first, Groq fallback, canned answers last)

The chatbot answers through the Vercel serverless function `api/chat.js`, with a
fallback chain in this exact order:

1. **Cohere first** - model `command-a-03-2025` (command-r-plus is deprecated, do not
   use it), key from `COHERE_API_KEY`.
2. **Groq fallback** - OpenAI-compatible chat completions endpoint
   `https://api.groq.com/openai/v1/chat/completions`, model `llama-3.3-70b-versatile`,
   key from `GROQ_API_KEY`. Used only when Cohere is not configured or its call fails.
3. **Canned answers** - the built-in answers in `src/components/Chatbot.tsx` when
   neither provider is configured or both fail.

Both providers use the same system prompt and knowledge base about Syed Ahsan, so
answers stay consistent whichever provider answers. The chatbot UI shows which
provider answered: "Answering with Cohere AI", "Answering with Groq AI", or the
canned-answers state. The keys are never logged or exposed in responses or errors.
Add both keys in Vercel under Project Settings - Environment Variables (all
environments), then redeploy. The same Cohere key used for Nexavo works here too.

If no key is set, or both providers fail, the chatbot falls back to its built-in
canned answers (services, research, projects, experience, contact), so the site
never breaks. Locally (`npm run dev`) there is no `/api/chat`, so the chatbot uses
the canned answers. To test the providers locally, run `vercel dev` instead.

## Database & Admin (Turso + admin dashboard)

Contact messages and chatbot queries are stored in a Turso database
(libSQL) and viewed in the admin dashboard at `/admin`.

**How login works:** open `/admin` and sign in with the admin password.
The server returns a signed token (HMAC-SHA256, valid for 7 days) that the
browser stores and sends with every admin request. If `ADMIN_PASSWORD` is not
set, the login screen shows setup steps instead of a password field.

**Tables** (created automatically on first use, no migration step needed):

- `contact_messages` - id, name, email, message, created_at, is_read
  (the selected service, if any, is stored at the start of the message text)
- `chat_queries` - id, question, answer, created_at

**API endpoints** (all under `api/`, Vercel serverless functions):

- `POST /api/contact` - save a contact message. Returns 503
  `DB_NOT_CONFIGURED` when the Turso variables are missing.
- `POST /api/chat` - AI chatbot with the Cohere, Groq, canned fallback chain.
  Successful replies are logged to `chat_queries`; logging never breaks the
  chat reply. The response includes a `provider` field (`cohere`, `groq`, or
  `canned`).
- `POST /api/admin/login` - sign in with `{password}`, returns a session token.
- `GET /api/admin/messages` - list contact messages, newest first
  (`?unread_only=1` filters unread). `PATCH` marks read/unread, `DELETE`
  removes one. Bearer token required.
- `GET /api/admin/queries` - list chat queries, newest first. `DELETE`
  removes one. Bearer token required.
- `GET /api/admin/stats` - message and query counts. Bearer token required.

**Local testing:** `npm run dev` does not run `/api/*`, so the database features
need `vercel dev` or the deployed site to test. With `vercel dev`, set the
variables in `.env.local` (never commit it).

## Project structure

```
.
├── api/
│   ├── _lib/
│   │   ├── db.js                # Turso client + table setup (not an endpoint)
│   │   └── auth.js              # admin token signing + verification
│   ├── admin/
│   │   ├── login.js             # POST /api/admin/login
│   │   ├── messages.js          # GET/PATCH/DELETE /api/admin/messages
│   │   ├── queries.js           # GET/DELETE /api/admin/queries
│   │   └── stats.js             # GET /api/admin/stats
│   ├── chat.js                  # AI chatbot: Cohere, Groq fallback, canned answers
│   └── contact.js               # POST /api/contact
├── public/
│   └── Images/                  # profile photo
├── src/
│   ├── components/              # Navigation, Footer, Chatbot, Contact, ParticleField,
│   │                            # CustomCursor, SiteFX, Motion, StatCount, Preloader
│   ├── data/
│   │   └── services.ts          # the 12 services + process steps + stats (single source)
│   ├── pages/                   # Home, Services, ServiceDetail, Process, Contact,
│   │                            # Admin, NotFound
│   ├── App.tsx                  # router + layout (scroll-to-top, route sweep, chatbot)
│   ├── index.css                # red theme tokens + animations
│   └── main.tsx
├── index.html
├── vercel.json                  # SPA rewrites, /api/ excluded
├── .env.example                 # key NAMES only, no values
└── README.md
```

## Notes

- `.env` files are never committed. `.env.example` lists only key names.
- Content rules: only verified facts are used. The FIN study is a working paper
  draft and the anomaly study is in progress, never labelled "published". The
  Smart Bin paper was submitted to ICECT 2027 as Paper ID 96.
- No prices, clients, or testimonials are listed anywhere on the site.
- GitHub: https://github.com/mscsAhsan
- LinkedIn: https://www.linkedin.com/in/syedahsanai-engr/
- Website: https://syedahsan-ai-engr.tech
