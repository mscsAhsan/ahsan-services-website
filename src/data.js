import { Code2, Globe, LayoutDashboard, Bot, BrainCircuit, Workflow } from "lucide-react";

export const services = [
  {
    id: "ai-web", num: "01", icon: Code2, title: "AI & Web Engineering",
    tag: "Intelligent web apps and platforms",
    desc: "We design and build modern web products with AI at the core: fast, secure, scalable and ready for real users.",
    items: ["AI-powered web apps", "Full-stack development", "REST / GraphQL APIs", "Admin dashboards", "Chatbot integration", "Cloud deployment"],
    tools: ["React", "Next.js", "Node.js", "Python", "FastAPI", "PostgreSQL"],
  },
  {
    id: "websites", num: "02", icon: Globe, title: "Websites",
    tag: "Fast, beautiful, conversion-ready",
    desc: "Premium, responsive websites that look sharp on every device and turn visitors into customers.",
    items: ["Business / portfolio sites", "E-commerce stores", "Landing pages", "Redesign and revamp", "SEO and speed tuning", "Hosting and maintenance"],
    tools: ["WordPress", "Shopify", "React", "Tailwind", "Figma"],
  },
  {
    id: "web-apps", num: "03", icon: LayoutDashboard, title: "Web Apps & Dashboards",
    tag: "Interactive apps and data dashboards",
    desc: "Interactive web apps and dashboards with React front ends and Flask + REST API back ends: data in, answers out.",
    items: ["React front ends", "Flask + REST API back ends", "Admin dashboards", "Data visualisation", "Auth and user accounts", "Cloud deployment"],
    tools: ["React", "Flask", "REST APIs", "PostgreSQL", "Tailwind", "Node.js"],
  },
  {
    id: "chatbots", num: "04", icon: Bot, title: "AI Chatbots & Assistants",
    tag: "Assistants that answer from your content",
    desc: "Cohere and LLM-powered chatbots that answer from your own content: trained on your docs, pages and FAQs, and plugged into your site.",
    items: ["LLM chatbots", "Trained on your content", "Website chat widget", "WhatsApp integration", "Multi-language replies", "Human handoff"],
    tools: ["Cohere", "Groq", "LangChain", "React", "Node.js", "Python"],
  },
  {
    id: "ai-ml", num: "05", icon: BrainCircuit, title: "AI & Machine Learning",
    tag: "Models that solve real problems",
    desc: "From data to deployed models. We build, train and ship machine learning systems that deliver measurable value.",
    items: ["Custom ML / DL models", "Computer vision", "NLP and LLM apps", "RAG pipelines", "Data analysis and BI", "Model deployment"],
    tools: ["PyTorch", "TensorFlow", "scikit-learn", "LangChain", "Power BI"],
  },
  {
    id: "automation", num: "06", icon: Workflow, title: "AI Tools & Automation",
    tag: "Small tools that save hours",
    desc: "Small AI tools, automations, prototypes and MVPs: a working version first, then iterate based on real use.",
    items: ["Custom AI tools", "Workflow automation", "Prototypes and MVPs", "API integrations", "Data pipelines", "Scripting and automation"],
    tools: ["Python", "FastAPI", "APIs", "PostgreSQL", "PyTorch", "Node.js"],
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
