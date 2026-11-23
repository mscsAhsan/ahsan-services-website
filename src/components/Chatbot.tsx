import React, { useState, useRef, useEffect } from "react";
import {
  ChatCircle,
  X,
  PaperPlaneTilt,
  Microphone,
  SpeakerSimpleHigh,
  Code,
  Briefcase,
  Envelope,
  GraduationCap,
  RocketLaunch,
  Info,
  Cpu,
  GithubLogo,
  LinkedinLogo,
  Phone,
  Brain,
  CaretDown,
  Lightning,
  Flask,
} from "phosphor-react";
import { Layers } from "lucide-react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}


type KBEntry = {
  text: string;
  options?: { label: string; value: string }[];
};

const knowledgeBase: Record<string, KBEntry> = {
  hi: {
    text: "Welcome! I'm Ahsan's AI Assistant.\n\nSyed Ahsan is an MS Computer Science student and Research Assistant at ITU Lahore, working on medical imaging and AI. He also builds AI-powered web applications.\n\nAsk me about his research, projects, experience, or how to reach him.",
    options: [
      { label: "Research", value: "research" },
      { label: "Projects", value: "projects" },
      { label: "About Ahsan", value: "about" },
    ],
  },
  research: {
    text: "Ahsan's research:\n\n" +
      "1. Optical lens inverse design (RA work, ITU) - AI-driven inverse design of optical lenses using FDTD simulation data and a deep-learning surrogate model.\n\n" +
      "2. FIN glaucoma fairness study - sole-author working paper (draft, not published). EfficientNet-B1, FIN-race AUC 85.6.\n\n" +
      "3. Anomaly-detection reproducibility study - in progress (draft). ~30 algorithms, 6 families, 16 ODDS datasets.",
    options: [
      { label: "Projects", value: "projects" },
      { label: "Contact", value: "contact" },
    ],
  },
  projects: {
    text: "Ahsan's projects:\n\n" +
      "• Smart Bin - AI waste segregation (FYP, Arduino + computer vision). Submitted to ICECT 2027 as Paper ID 96. GitHub: github.com/mscsAhsan/smart-bin\n\n" +
      "• AI-powered diabetes prediction - Flask + ML web app.\n\n" +
      "• Nexavo AI - founder of a Pakistan-only AI tools store with Safepay checkout (PKR).\n\n" +
      "• Plus his research projects: optical lens inverse design, the FIN fairness study, and the anomaly-detection study.",
    options: [
      { label: "Research", value: "research" },
      { label: "Tech Stack", value: "tech stack" },
    ],
  },
  services: {
    text: "What Ahsan does:\n\n" +
      "• AI / ML systems - computer vision, deep learning, model training and evaluation.\n\n" +
      "• Research - medical imaging and AI, fairness in medical AI, reproducibility studies.\n\n" +
      "• Web development - React front-ends, Flask back-ends, REST APIs.\n\n" +
      "For project or collaboration enquiries, reach him directly - see Contact.",
    options: [
      { label: "Tech Stack", value: "tech stack" },
      { label: "Contact", value: "contact" },
    ],
  },
  "tech stack": {
    text: "Ahsan's toolkit:\n\n" +
      "• AI / ML - Python, PyTorch, TensorFlow, OpenCV\n\n" +
      "• Research tools - MATLAB, Ansys Lumerical, FDTD, LaTeX\n\n" +
      "• Programming - Python, SQL, Flask, REST APIs, React",
    options: [
      { label: "Experience", value: "experience" },
      { label: "Projects", value: "projects" },
    ],
  },
  about: {
    text: "Syed Ahsan (Muhammad Ahsan Shah) - MS Computer Science student at ITU Lahore (Aug 2026-present), Research Assistant in medical imaging and AI (since Mar 2026), and Teaching Assistant for Numerical Analysis.\n\nHe completed his BS in Artificial Intelligence at The Islamia University of Bahawalpur in 2026, interned at the Deep Embed Lab, and served as president of the IUB Skills & Career Development Society.",
    options: [
      { label: "Education", value: "education" },
      { label: "Experience", value: "experience" },
    ],
  },
  education: {
    text: "Education:\n\n" +
      "• MS Computer Science - Information Technology University (ITU), Lahore. Aug 2026-present.\n\n" +
      "• BS Artificial Intelligence - The Islamia University of Bahawalpur (IUB). Completed 2026.",
    options: [
      { label: "Experience", value: "experience" },
      { label: "Contact", value: "contact" },
    ],
  },
  experience: {
    text: "Experience:\n\n" +
      "• Research Assistant - ITU Lahore (Mar 2026-present). medical imaging and AI: inverse design of optical lenses with FDTD data + a deep-learning surrogate.\n\n" +
      "• Teaching Assistant, Numerical Analysis - ITU Lahore (Aug 2026-present).\n\n" +
      "• Intern - Deep Embed Lab, IUB (Oct 2023-Nov 2024).\n\n" +
      "• President, IUB Skills & Career Development Society - ran Python, marketing and analytics courses for 1000+ students. Also IEEE Student Branch leadership.",
    options: [
      { label: "Research", value: "research" },
      { label: "Contact", value: "contact" },
    ],
  },
  contact: {
    text: "Contact Ahsan:\n\n" +
      "Email: asmatullahshah0343@gmail.com\n" +
      "ITU email: mscs26017@itu.edu.pk\n" +
      "Phone / WhatsApp: +92 341 6985286\n" +
      "Location: Lahore, Pakistan\n" +
      "LinkedIn: linkedin.com/in/syedahsanai-engr\n" +
      "GitHub: github.com/mscsAhsan",
  },
  help: {
    text: "I can tell you about:\n\n• Ahsan's research and projects\n• His education and experience\n• His tech stack\n• How to contact him",
    options: [
      { label: "Research", value: "research" },
      { label: "Contact", value: "contact" },
    ],
  },
  fallback: {
    text: "I don't have an answer for that - I only know about Ahsan's research, projects, education, experience and contact details.\n\nWould you like to see his research or contact him directly?",
    options: [
      { label: "Research", value: "research" },
      { label: "Contact", value: "contact" },
    ],
  },
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [provider, setProvider] = useState<'cohere' | 'groq' | 'canned'>('canned');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      fullText: "Hi! I'm Ahsan's AI Assistant. Ask me about his research, projects, or experience.",
      displayed: "Hi! I'm Ahsan's AI Assistant. Ask me about his research, projects, or experience.",
      isBot: true,
    },
  ]);

  const endRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const sidebarActions = [
    { label: "Research", value: "research", icon: <Flask size={16} /> },
    { label: "Projects", value: "projects", icon: <Code size={16} /> },
    { label: "About", value: "about", icon: <GraduationCap size={16} /> },
    { label: "Contact", value: "contact", icon: <Envelope size={16} /> },
    { label: "Stack", value: "tech stack", icon: <Layers size={16} /> },
    { label: "Experience", value: "experience", icon: <RocketLaunch size={16} /> },
    { label: "Help", value: "help", icon: <Info size={16} /> },
  ];


  useEffect(() => {
    if (isOpen && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  const typeOut = async (msgId: number, text: string) => {
    let current = "";
    const chars = text.split("");
    for (let i = 0; i < chars.length; i++) {
      current += chars[i];
      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, displayed: current } : m)));
      const speed = text.length > 100 ? 5 : 12;
      await new Promise((r) => setTimeout(r, speed));
    }
  };

  const processQuery = async (query: string) => {
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 600));

    const lowered = query.toLowerCase();
    const key = Object.keys(knowledgeBase).find((k) => lowered.includes(k));

    if (key) {
      const entry = knowledgeBase[key];
      const botId = Date.now();

      setMessages((prev) => [
        ...prev,
        {
          id: botId,
          fullText: entry.text,
          displayed: "",
          isBot: true,
          options: entry.options,
        },
      ]);

      await typeOut(botId, entry.text);
    } else {


      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: query }),
        });

        const data = await response.json();
        if (response.ok && data.reply) {
          setProvider(data.provider === "groq" ? "groq" : "cohere");
        } else if (data.reply) {
          setProvider("canned");
        }
        const botId = Date.now();
        const isRateLimit = response.status === 429 || (data.reply && data.reply.includes("Too many requests"));

        const fallbackOptions = [
          { label: "Research", value: "research" },
          { label: "About Ahsan", value: "about" },
          { label: "Contact", value: "contact" },
        ];

        setMessages((prev) => [
          ...prev,
          {
            id: botId,
            fullText: data.reply || knowledgeBase.fallback.text,
            displayed: "",
            isBot: true,
            options: isRateLimit ? fallbackOptions : undefined,
          },
        ]);

        await typeOut(botId, data.reply || knowledgeBase.fallback.text);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            fullText: "Cohere AI isn't reachable right now, but I can still answer from what I know about Ahsan. Try asking about his research, projects, or contact details.",
            displayed: "Cohere AI isn't reachable right now, but I can still answer from what I know about Ahsan. Try asking about his research, projects, or contact details.",
            isBot: true,
            options: [
              { label: "Research", value: "research" },
              { label: "Contact", value: "contact" },
            ],
          },
        ]);
      }
    }

    setIsTyping(false);
  };

  const sendMessage = async (val?: string) => {
    const text = (val || input).trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        fullText: text,
        displayed: text,
        isBot: false,
      },
    ]);

    setInput("");
    await processQuery(text);
  };

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice recognition is not available in this browser.");

    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: any) => sendMessage(e.results[0][0].transcript);
    recognition.start();
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[9999] flex flex-col items-end font-sans selection:bg-primary/30">
      {isOpen && (
        <div className="flex flex-col md:flex-row-reverse gap-4 items-end mb-4 w-[92vw] sm:w-[400px] md:w-auto transition-all duration-500">

          <div className="hidden md:flex flex-col gap-2 max-h-[450px] overflow-y-auto no-scrollbar py-2">
            {sidebarActions.map((item, i) => (
              <button
                key={i}
                onClick={() => sendMessage(item.value)}
                className="flex items-center gap-3 bg-card/90 backdrop-blur-xl border border-border text-muted-foreground text-[10px] uppercase tracking-[0.2em] py-4 px-6 rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all w-48 group shadow-xl hover:border-primary"
              >
                <span className="text-primary group-hover:text-primary-foreground transition-colors">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>


          <div
            ref={chatWindowRef}
            className="w-full md:w-[420px] h-[75vh] md:h-[520px] bg-card border border-border rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative animate-in fade-in zoom-in duration-300"
          >

            <div className="p-5 md:p-6 border-b border-border bg-secondary text-secondary-foreground flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-3 bg-gradient-primary rounded-2xl shadow-lg ring-1 ring-white/20">
                    <Cpu size={24} weight="duotone" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-[3.5px] border-card animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-[13px] font-bold uppercase tracking-widest flex items-center gap-2">
                    Ahsan&apos;s AI Assistant <Lightning size={12} weight="fill" className="text-accent" />
                  </h3>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-70">
                    {provider === "cohere" ? "Answering with Cohere AI" : provider === "groq" ? "Answering with Groq AI" : "Research · Projects · Contact"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-3 bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all border border-white/10"
              >
                <X size={18} weight="bold" />
              </button>
            </div>


            <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 scrollbar-hide z-10">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.isBot ? "justify-start" : "justify-end"} animate-fade-in`}>
                  <div className="max-w-[90%] space-y-3">
                    <div
                      className={`p-4 md:p-5 rounded-[2rem] text-[13px] md:text-[14px] leading-relaxed shadow-lg relative group ${
                        m.isBot
                          ? "bg-muted text-foreground border border-border rounded-tl-none"
                          : "bg-primary text-primary-foreground rounded-tr-none font-medium"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.isBot ? m.displayed : m.fullText}</div>
                    </div>

                    {m.isBot && !isTyping && m.options && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {m.options.map((opt: any, i: number) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(opt.value)}
                            className="text-[10px] font-bold bg-muted border border-border px-4 py-2.5 rounded-2xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all uppercase tracking-widest text-muted-foreground active:scale-95"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-4 text-[10px] text-primary font-bold uppercase tracking-[0.3em] px-2">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping [animation-delay:0.2s]"></div>
                  </div>
                  Thinking...
                </div>
              )}
              <div ref={endRef} />
            </div>


            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="p-5 md:p-7 bg-muted/60 backdrop-blur-xl border-t border-border flex items-center gap-4 z-10"
            >
              <button
                type="button"
                onClick={startVoice}
                className={`p-4 rounded-2xl transition-all border border-border flex items-center justify-center ${
                  isListening
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/40 scale-110"
                    : "bg-card text-muted-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {isListening ? <SpeakerSimpleHigh size={20} weight="fill" /> : <Microphone size={20} weight="bold" />}
              </button>

              <div className="flex-1 relative group">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Ahsan..."
                  className="w-full bg-card border border-border rounded-2xl px-6 py-4 text-foreground text-sm outline-none focus:border-primary focus:bg-card transition-all placeholder:text-muted-foreground/60"
                />
              </div>

              <button
                type="submit"
                disabled={!input.trim()}
                className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/20 disabled:opacity-20 active:scale-90 transition-all hover:bg-primary-glow"
              >
                <PaperPlaneTilt size={22} weight="fill" />
              </button>
            </form>
          </div>
        </div>
      )}


      <div className="relative group">
        <div className="absolute inset-[-12px] bg-gradient-primary rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-40 transition-all duration-700"></div>

        <button
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`animate-scale-in w-12 h-12 md:w-16 md:h-16 bg-gradient-primary rounded-2xl md:rounded-3xl flex items-center justify-center text-primary-foreground shadow-2xl hover:scale-110 active:scale-90 transition-all duration-500 relative z-10 border border-white/20 ${
            isOpen ? "bg-none bg-secondary rotate-90" : ""
          }`}
        >
          {isOpen ? (
            <X size={28} weight="bold" />
          ) : (
            <div className="relative">
              <ChatCircle size={32} weight="fill" className="md:w-9 md:h-9" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
            </div>
          )}
        </button>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .scrollbar-hide, .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px) scale(0.95); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default Chatbot;
