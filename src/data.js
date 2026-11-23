import { Code2, Globe, Share2, TrendingUp, BrainCircuit, FlaskConical } from "lucide-react";

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
    id: "social", num: "03", icon: Share2, title: "Social Media",
    tag: "Grow, engage and stay consistent",
    desc: "Consistent, on-brand content and management that builds an engaged community around your business.",
    items: ["Content calendar", "Posts, reels, stories", "Page management", "Community engagement", "Paid ad campaigns", "Monthly analytics report"],
    tools: ["Canva", "CapCut", "Meta Business Suite", "Buffer", "Adobe"],
  },
  {
    id: "digital", num: "04", icon: TrendingUp, title: "Digital",
    tag: "Marketing that brings real customers",
    desc: "Full-funnel digital growth: be found on Google, stand out visually and convert attention into sales.",
    items: ["SEO and local SEO", "Google and Meta ads", "Logo and branding", "Creative design", "Email marketing", "Conversion tracking"],
    tools: ["Google Ads", "Analytics", "Search Console", "Meta Ads", "Mailchimp"],
  },
  {
    id: "ai-ml", num: "05", icon: BrainCircuit, title: "AI & Machine Learning",
    tag: "Models that solve real problems",
    desc: "From data to deployed models. We build, train and ship machine learning systems that deliver measurable value.",
    items: ["Custom ML / DL models", "Computer vision", "NLP and LLM apps", "RAG pipelines", "Data analysis and BI", "Model deployment"],
    tools: ["PyTorch", "TensorFlow", "scikit-learn", "LangChain", "Power BI"],
  },
  {
    id: "research", num: "06", icon: FlaskConical, title: "Research",
    tag: "Rigorous, publication-grade work",
    desc: "Structured, well-documented research support, from idea and methodology to experiments and write-up.",
    items: ["Literature review", "Methodology design", "Experiments and results", "Technical paper writing", "Data visualization", "Presentation support"],
    tools: ["Python", "Jupyter", "LaTeX", "Zotero", "Excel", "Power BI"],
  },
];

export const stats = [
  { to: 50, suffix: "+", label: "Projects delivered" },
  { to: 30, suffix: "+", label: "Happy clients" },
  { to: 6, suffix: "", label: "Core services" },
  { to: 24, suffix: "/7", label: "Support & updates" },
];

export const process = [
  { n: "01", t: "Discover", d: "We learn your goals, audience and needs." },
  { n: "02", t: "Plan", d: "Scope, timeline and design direction." },
  { n: "03", t: "Build", d: "Design, development and testing with regular updates." },
  { n: "04", t: "Launch", d: "Go live, then support and optimize." },
];

export const packages = [
  { name: "Starter", price: "PKR XX,XXX", hot: false, feats: ["Up to 5 pages", "Responsive design", "Basic SEO setup", "7 days support"] },
  { name: "Growth", price: "PKR XX,XXX", hot: true, feats: ["Everything in Starter", "Custom features / CMS", "Social media setup", "30 days support"] },
  { name: "Premium", price: "PKR XXX,XXX", hot: false, feats: ["Everything in Growth", "AI / ML integration", "Monthly marketing", "Priority support"] },
];

export const marqueeItems = ["React", "Next.js", "Node.js", "Python", "PyTorch", "TensorFlow", "LangChain", "Groq", "Cohere", "PostgreSQL", "Figma", "Tailwind", "Power BI", "Google Ads", "Meta Ads", "SEO"];
