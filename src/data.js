import { Code2, Globe, LayoutDashboard, Bot, BrainCircuit, Workflow } from "lucide-react";

export const services = [
  {
    id: "ai-web", slug: "ai-web", image: "/images/service-ai-web.jpg", num: "01", icon: Code2, title: "AI & Web Engineering",
    tag: "Intelligent web apps and platforms",
    desc: "We design and build modern web products with AI at the core: fast, secure, scalable and ready for real users.",
    long: "Most projects start as an idea and a rough sketch. We turn that into a working product: a clear scope, a modern front end, a solid back end, and AI features that do real work instead of sitting on a slide. Everything is built to be fast, secure and easy to keep running.",
    items: ["AI-powered web apps", "Full-stack development", "REST / GraphQL APIs", "Admin dashboards", "Chatbot integration", "Cloud deployment"],
    tools: ["React", "Next.js", "Node.js", "Python", "FastAPI", "PostgreSQL"],
    faqs: [
      { q: "How do we start?", a: "Tell us about your idea through the Contact page or WhatsApp. We talk through the goal, the audience and what success looks like, then agree on scope before any work begins." },
      { q: "What do you need from me?", a: "A short description of the product, any content or accounts you already have, and one or two examples of products you like. We handle the rest." },
      { q: "Do you support the product after launch?", a: "Yes. Support and updates are part of every package, and we fix anything we built." },
      { q: "Can AI features be added to a site I already have?", a: "Yes. Chatbots, search, recommendations and automations can usually be added to a site you already run." },
    ],
  },
  {
    id: "websites", slug: "websites", image: "/images/service-websites.jpg", num: "02", icon: Globe, title: "Websites",
    tag: "Fast, beautiful, conversion-ready",
    desc: "Premium, responsive websites that look sharp on every device and turn visitors into customers.",
    long: "A website should load fast, look sharp on every screen and make it obvious what to do next. We build that: clean design, clear structure, and the technical setup - speed, SEO basics and hosting - handled for you.",
    items: ["Business / portfolio sites", "E-commerce stores", "Landing pages", "Redesign and revamp", "SEO and speed tuning", "Hosting and maintenance"],
    tools: ["WordPress", "Shopify", "React", "Tailwind", "Figma"],
    faqs: [
      { q: "How do we start?", a: "Tell us about your idea through the Contact page or WhatsApp. We talk through the goal, the audience and what success looks like, then agree on scope before any work begins." },
      { q: "I already have a website. Can you redesign it?", a: "Yes. We review what you have, keep what works, and rebuild the design and structure around your goals." },
      { q: "Do you handle hosting and domain setup?", a: "Yes, hosting and maintenance are part of the service, and we help with domain setup." },
      { q: "Will my site work on phones?", a: "Yes. Every site is built responsive, so it works on phones, tablets and desktops." },
    ],
  },
  {
    id: "web-apps", slug: "web-apps-dashboards", image: "/images/service-dashboards.jpg", num: "03", icon: LayoutDashboard, title: "Web Apps & Dashboards",
    tag: "Interactive apps and data dashboards",
    desc: "Interactive web apps and dashboards with React front ends and Flask + REST API back ends: data in, answers out.",
    long: "Dashboards and web apps live or die by how easy they are to use. We build React front ends on Flask and REST API back ends, so your data turns into clear answers: tables, charts and workflows your team can actually use every day.",
    items: ["React front ends", "Flask + REST API back ends", "Admin dashboards", "Data visualisation", "Auth and user accounts", "Cloud deployment"],
    tools: ["React", "Flask", "REST APIs", "PostgreSQL", "Tailwind", "Node.js"],
    faqs: [
      { q: "How do we start?", a: "Tell us about your idea through the Contact page or WhatsApp. We talk through the goal, the audience and what success looks like, then agree on scope before any work begins." },
      { q: "Can the dashboard connect to my existing data?", a: "In most cases, yes. We connect to databases, spreadsheets and APIs you already use." },
      { q: "Do users get their own logins?", a: "Yes. Auth and user accounts are part of the service, with roles for different kinds of users." },
      { q: "What happens after launch?", a: "Support and updates are included, and we keep improving the app based on how your team uses it." },
    ],
  },
  {
    id: "chatbots", slug: "ai-chatbots-assistants", image: "/images/service-chatbots.jpg", num: "04", icon: Bot, title: "AI Chatbots & Assistants",
    tag: "Assistants that answer from your content",
    desc: "Cohere and LLM-powered chatbots that answer from your own content: trained on your docs, pages and FAQs, and plugged into your site.",
    long: "A good assistant answers from your own content, not from guesswork. We build chatbots trained on your docs, pages and FAQs, plug them into your site or WhatsApp, and hand the conversation to a human when the question needs one.",
    items: ["LLM chatbots", "Trained on your content", "Website chat widget", "WhatsApp integration", "Multi-language replies", "Human handoff"],
    tools: ["Cohere", "Groq", "LangChain", "React", "Node.js", "Python"],
    faqs: [
      { q: "How do we start?", a: "Tell us about your idea through the Contact page or WhatsApp. We talk through the goal, the audience and what success looks like, then agree on scope before any work begins." },
      { q: "What content do you need to train the chatbot?", a: "Your docs, pages, FAQs or product information. If you do not have them written down, we help you put them together." },
      { q: "Can it reply in Urdu or Roman Urdu?", a: "Yes. The assistant can reply in English, Urdu or Roman Urdu, matching how your visitor writes." },
      { q: "What happens when the bot cannot answer?", a: "The conversation is handed to a human, so no visitor is left without an answer." },
    ],
  },
  {
    id: "ai-ml", slug: "ai-ml", image: "/images/service-ai-ml.jpg", num: "05", icon: BrainCircuit, title: "AI & Machine Learning",
    tag: "Models that solve real problems",
    desc: "From data to deployed models. We build, train and ship machine learning systems that deliver measurable value.",
    long: "Machine learning only matters when it works on your real data. We take a problem, look at the data honestly, build and test a model, and ship it as something you can use - not as a notebook that never leaves the lab.",
    items: ["Custom ML / DL models", "Computer vision", "NLP and LLM apps", "RAG pipelines", "Data analysis and BI", "Model deployment"],
    tools: ["PyTorch", "TensorFlow", "scikit-learn", "LangChain", "Power BI"],
    faqs: [
      { q: "How do we start?", a: "Tell us about your idea through the Contact page or WhatsApp. We talk through the goal, the audience and what success looks like, then agree on scope before any work begins." },
      { q: "What if my data is messy or incomplete?", a: "We look at it first and tell you honestly what is possible with it. If more data is needed, we say so before any modelling starts." },
      { q: "Do I own the model and the code?", a: "Yes. Everything we build for you, including the model and the code, is yours." },
      { q: "How do I use the model once it is built?", a: "We deploy it as an API, a dashboard or a tool inside your existing system, so your team can use it without touching code." },
    ],
  },
  {
    id: "automation", slug: "ai-tools-automation", image: "/images/service-automation.jpg", num: "06", icon: Workflow, title: "AI Tools & Automation",
    tag: "Small tools that save hours",
    desc: "Small AI tools, automations, prototypes and MVPs: a working version first, then iterate based on real use.",
    long: "The best automations are small: one repetitive task, done by a tool instead of by hand. We start with a working version of the most painful task, then add more once it proves itself in real use.",
    items: ["Custom AI tools", "Workflow automation", "Prototypes and MVPs", "API integrations", "Data pipelines", "Scripting and automation"],
    tools: ["Python", "FastAPI", "APIs", "PostgreSQL", "PyTorch", "Node.js"],
    faqs: [
      { q: "How do we start?", a: "Tell us about your idea through the Contact page or WhatsApp. We talk through the goal, the audience and what success looks like, then agree on scope before any work begins." },
      { q: "What kind of tasks can be automated?", a: "Repetitive work like data entry, report generation, file handling and routine messages between tools you already use." },
      { q: "Do I need technical knowledge to use the tools?", a: "No. The tools are built for your team to use directly, and we show you how they work." },
      { q: "What if an automation breaks?", a: "Support is included, and we fix anything we built." },
    ],
  },
];

export const stats = [
  { to: 6, suffix: "+", label: "Projects built" },
  { to: 6, suffix: "", label: "Core services" },
  { to: 10, suffix: "+", label: "Tools & frameworks" },
  { to: 24, suffix: "/7", label: "Support & updates" },
];

export const process = [
  { n: "01", t: "Discover", d: "We learn your goals, audience and needs." },
  { n: "02", t: "Plan", d: "Scope, timeline and design direction." },
  { n: "03", t: "Build", d: "Design, development and testing with regular updates." },
  { n: "04", t: "Launch", d: "Go live, then support and optimize." },
];

export const packages = [
  { name: "Starter", hot: false, feats: ["Up to 5 pages", "Responsive design", "Basic SEO setup", "7 days support"] },
  { name: "Growth", hot: true, feats: ["Everything in Starter", "Custom features / CMS", "Chatbot setup", "30 days support"] },
  { name: "Premium", hot: false, feats: ["Everything in Growth", "AI / ML integration", "Automation and APIs", "Priority support"] },
];

export const marqueeItems = ["React", "Next.js", "Node.js", "Python", "FastAPI", "PyTorch", "TensorFlow", "scikit-learn", "OpenCV", "PostgreSQL", "Flask", "Tailwind"];
