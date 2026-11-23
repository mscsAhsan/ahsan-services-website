import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageCircle } from "lucide-react";
import { BRAND } from "../config";
import { services } from "../data";
import SectionHead from "../components/SectionHead";
import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";
import AnimatedIcon from "../components/AnimatedIcon";

const API = import.meta.env.VITE_API_BASE || "";

export default function Contact() {
  const [params] = useSearchParams();
  const initialService = services.find((s) => s.slug === params.get("service"))?.title || services[0].title;
  const [form, setForm] = useState({ name: "", email: "", service: initialService, message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    setErr("");
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("sent");
    } catch (e2) {
      setErr(e2.message);
      setStatus("error");
    }
  }

  const info = [
    { icon: Mail, t: "Email", v: BRAND.email, href: `mailto:${BRAND.email}` },
    { icon: MessageCircle, t: "WhatsApp", v: BRAND.whatsappDisplay, href: `https://wa.me/${BRAND.whatsapp}` },
    { icon: Phone, t: "Website", v: BRAND.site, href: `https://${BRAND.site.replace(/^https?:\/\//, "")}` },
    { icon: MapPin, t: "Location", v: BRAND.location },
  ];

  return (
    <div className="container page-top">
      <SectionHead kicker="Get in touch" title="Let's talk about your project" sub="Tell us about your idea and we will reply within 24 hours with a plan and a free quote." />
      <div className="contact-grid">
        <div className="contact-info">
          {info.map((c, i) => (
            <Reveal key={c.t} delay={0.08 * i}>
              <TiltCard className="info-card" max={6}>
                <AnimatedIcon icon={c.icon} size={22} box={48} delay={i * 0.2} />
                <div>
                  <small className="muted">{c.t}</small>
                  {c.href ? <a href={c.href} target="_blank" rel="noreferrer">{c.v}</a> : <span>{c.v}</span>}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="form-wrap">
          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div key="ok" className="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.15 }}>
                  <CheckCircle2 size={72} />
                </motion.div>
                <h3 className="h3">Message sent!</h3>
                <p className="muted">Thanks {form.name.split(" ")[0]}, we will get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <motion.form key="form" className="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <label>Your name<input required value={form.name} onChange={set("name")} placeholder="Ali Khan" maxLength={100} /></label>
                <label>Email<input required type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" maxLength={150} /></label>
                <label>Service
                  <select value={form.service} onChange={set("service")}>
                    {services.map((s) => <option key={s.id}>{s.title}</option>)}
                  </select>
                </label>
                <label>Message<textarea required rows={5} value={form.message} onChange={set("message")} placeholder="Tell us about your project..." maxLength={3000} /></label>
                {status === "error" && <div className="form-err">{err}</div>}
                <button className="btn btn-primary block" disabled={status === "sending"}>
                  {status === "sending" ? "Sending..." : <>Send message <Send size={16} /></>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </div>
  );
}
