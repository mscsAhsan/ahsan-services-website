import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { BRAND } from "../config";

const API = import.meta.env.VITE_API_BASE || "";
const CHIPS = ["What services do you offer?", "I need a website", "AI chatbot for my business", "How does pricing work?"];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState([
    { role: "assistant", content: `Hi! I'm Aria, the AI assistant of ${BRAND.name}. Ask me about our services, or tell me about your project.` },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy, open]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    const next = [...msgs, { role: "user", content }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      // first message is our greeting, so don't send it back to the model
      const history = next.slice(1).slice(-10);
      const res = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMsgs((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMsgs((m) => [...m, { role: "assistant", content: "Sorry, I'm having trouble right now. You can reach us on the Contact page or WhatsApp." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <motion.button
        className="chat-fab"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2.8, type: "spring" }}
        aria-label="Open chat"
        data-cursor
      >
        <span className="fab-ring" />
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={26} /></motion.span>
          ) : (
            <motion.span key="b" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Bot size={26} /></motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="chat"
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className="chat-head">
              <span className="chat-avatar"><Sparkles size={18} /></span>
              <div>
                <strong>Aria</strong>
                <small><i className="online" /> AI assistant · online</small>
              </div>
              <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat" data-cursor><X size={20} /></button>
            </div>

            <div className="chat-body">
              {msgs.map((m, i) => (
                <motion.div key={i} className={`bubble ${m.role}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {m.content}
                </motion.div>
              ))}
              {busy && (
                <div className="bubble assistant typing"><i /><i /><i /></div>
              )}
              {msgs.length === 1 && (
                <div className="chips">
                  {CHIPS.map((c) => <button key={c} onClick={() => send(c)}>{c}</button>)}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." maxLength={500} />
              <button type="submit" disabled={busy || !input.trim()} aria-label="Send"><Send size={18} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
