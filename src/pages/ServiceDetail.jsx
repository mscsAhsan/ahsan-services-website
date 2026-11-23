import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { services, process } from "../data";
import SectionHead from "../components/SectionHead";
import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";
import AnimatedIcon from "../components/AnimatedIcon";
import Magnetic from "../components/Magnetic";
import NotFound from "./NotFound";

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);
  if (!service) return <NotFound />;
  const related = services.filter((s) => s.slug !== slug);

  return (
    <div className="container page-top">
      <SectionHead kicker={service.tag} title={service.title} sub={service.desc} />

      <Reveal>
        <img src={service.image} alt={`${service.title} - abstract dark red visual`} loading="lazy" className="detail-hero-img" />
      </Reveal>

      {/* ---------- OVERVIEW + INCLUDED + TOOLS ---------- */}
      <Reveal className="svc-row">
        <TiltCard className="svc-visual" max={8}>
          <img src={service.image} alt={`${service.title} - abstract dark red visual`} loading="lazy" className="svc-img" />
          <div className="svc-img-shade" />
          <motion.div className="big-icon" animate={{ rotate: [0, 4, -4, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
            <AnimatedIcon icon={service.icon} size={54} box={110} />
          </motion.div>
          <div className="big-num">{service.num}</div>
        </TiltCard>

        <div className="svc-info">
          <div className="kicker">Overview</div>
          <p className="lead">{service.long}</p>
          <div className="inc-title">What's included</div>
          <ul className="checks two">
            {service.items.map((it) => <li key={it}><Check size={16} /> {it}</li>)}
          </ul>
          <div className="inc-title">Tools & technologies</div>
          <div className="chips-row">
            {service.tools.map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
        </div>
      </Reveal>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="section">
        <SectionHead kicker="How we work" title="How it works" />
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

      {/* ---------- FAQS ---------- */}
      <section className="section">
        <SectionHead kicker="Good to know" title="Frequently asked questions" />
        {service.faqs.map((f, i) => (
          <Reveal key={f.q} delay={0.06 * i}>
            <h4>{f.q}</h4>
            <p className="muted">{f.a}</p>
          </Reveal>
        ))}
      </section>

      {/* ---------- RELATED SERVICES ---------- */}
      <section className="section">
        <SectionHead kicker="Keep exploring" title="Related services" />
        <div className="grid-3">
          {related.map((s, i) => (
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
                <Link to={`/services/${s.slug}`} className="more">Learn more <ArrowUpRight size={16} /></Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <Reveal className="center-cta">
        <Magnetic><Link to={`/contact?service=${service.slug}`} className="btn btn-primary">Start this project <ArrowRight size={18} /></Link></Magnetic>
      </Reveal>
    </div>
  );
}
