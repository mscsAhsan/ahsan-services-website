import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Sparkles } from "lucide-react";
import { BRAND } from "../config";
import { services, stats, process, packages, marqueeItems } from "../data";
import NeuralBackground from "../components/NeuralBackground";
import OrbitVisual from "../components/OrbitVisual";
import SplitText from "../components/SplitText";
import Magnetic from "../components/Magnetic";
import Reveal from "../components/Reveal";
import SectionHead from "../components/SectionHead";
import TiltCard from "../components/TiltCard";
import AnimatedIcon from "../components/AnimatedIcon";
import Counter from "../components/Counter";

const words = ["AI & Web Engineering", "Websites", "Web Apps & Dashboards", "AI Chatbots & Assistants", "Machine Learning", "AI Tools & Automation"];

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="rot">
      <AnimatePresence mode="wait">
        <motion.span key={i} initial={{ y: 10, opacity: 0.2, filter: "blur(2px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: -10, opacity: 0.2, filter: "blur(2px)" }} transition={{ duration: 0.35 }}>
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <NeuralBackground />
        <div className="container hero-grid">
          <div className="hero-copy">
            <motion.div className="pill-live" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <i className="online" /> Available for new projects
            </motion.div>
            <h1 className="h1">
              <SplitText text="We Build" delay={0.3} />
              <br />
              <SplitText text="Intelligent" className="grad" delay={0.55} />
              <br />
              <SplitText text="Digital Experiences" delay={0.85} />
            </h1>
            <motion.p className="lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
              AI-powered web apps, intelligent systems and machine learning, built end to end. Specialists in <RotatingWord />
            </motion.p>
            <motion.div className="hero-btns" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }}>
              <Magnetic><Link to="/contact" className="btn btn-primary">Start a project <ArrowRight size={18} /></Link></Magnetic>
              <Magnetic><Link to="/services" className="btn btn-ghost">Explore services</Link></Magnetic>
            </motion.div>
          </div>
          <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <OrbitVisual />
          </motion.div>
        </div>
        <div className="scroll-hint"><span /></div>
      </section>

      {/* ---------- MARQUEE ---------- */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((m, i) => (
            <span key={i}><Sparkles size={14} /> {m}</span>
          ))}
        </div>
      </div>

      {/* ---------- SERVICES ---------- */}
      <section className="section container">
        <SectionHead kicker="What we do" title="Our services" sub="Six core areas. Mix and match to fit your goals." />
        <div className="grid-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={0.08 * (i % 3)}>
              <TiltCard className="svc-card">
                <div className="svc-card-img">
                  <img src={s.image} alt={`${s.title} - abstract dark red visual`} loading="lazy" />
                </div>
                <div className="svc-top">
                  <AnimatedIcon icon={s.icon} delay={i * 0.25} />
                  <span className="svc-num">{s.num}</span>
                </div>
                <h3>{s.title}</h3>
                <p className="muted">{s.tag}</p>
                <ul className="dots">
                  {s.items.slice(0, 3).map((it) => <li key={it}>{it}</li>)}
                </ul>
                <Link to={`/services/${s.slug}`} className="more">Learn more <ArrowUpRight size={16} /></Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- STATS ---------- */}
      <section className="section container">
        <div className="stats">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={0.08 * i} className="stat">
              <div className="stat-num"><Counter to={s.to} suffix={s.suffix} /></div>
              <div className="muted">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- PROCESS ---------- */}
      <section className="section container">
        <SectionHead kicker="How we work" title="Our process" />
        <div className="steps">
          <motion.div className="steps-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: "easeInOut" }} />
          {process.map((p, i) => (
            <Reveal key={p.n} delay={0.15 * i}>
              <TiltCard className="step">
                <div className="step-n">{p.n}</div>
                <h4>{p.t}</h4>
                <p className="muted">{p.d}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- PACKAGES ---------- */}
      <section className="section container">
        <SectionHead kicker="Pricing" title="Packages" sub="Three tiers. Final pricing depends on your scope, so tell us your idea for a free quote." />
        <div className="grid-3 pk-grid">
          {packages.map((p, i) => (
            <Reveal key={p.name} delay={0.12 * i}>
              <TiltCard className={`pk ${p.hot ? "hot" : ""}`}>
                {p.hot && <span className="badge-pop">MOST POPULAR</span>}
                <h3>{p.name}</h3>
                <div className="pk-price">Custom quote</div>
                <ul className="checks">
                  {p.feats.map((f) => <li key={f}><Check size={16} /> {f}</li>)}
                </ul>
                <Link to="/contact" className={`btn ${p.hot ? "btn-light" : "btn-ghost"} block`}>Request a quote</Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="section container">
        <Reveal className="cta">
          <div className="cta-glow" />
          <h2 className="h2">Let's build something <span className="grad-text">remarkable</span> together</h2>
          <p className="lead">Tell us about your idea and we will reply within 24 hours with a plan and a free quote.</p>
          <Magnetic><Link to="/contact" className="btn btn-primary">Get in touch <ArrowRight size={18} /></Link></Magnetic>
          <small className="muted">{BRAND.email}</small>
        </Reveal>
      </section>
    </>
  );
}
