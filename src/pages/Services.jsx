import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { services } from "../data";
import SectionHead from "../components/SectionHead";
import Reveal from "../components/Reveal";
import AnimatedIcon from "../components/AnimatedIcon";
import TiltCard from "../components/TiltCard";
import Magnetic from "../components/Magnetic";

export default function Services() {
  return (
    <div className="container page-top">
      <SectionHead kicker="In detail" title="Everything we offer" sub="From AI-powered products to social media growth and research, here is what is included in each service." />

      <div className="svc-list">
        {services.map((s, i) => (
          <Reveal key={s.id} className={`svc-row ${i % 2 ? "flip" : ""}`}>
            <TiltCard className="svc-visual" max={8}>
              <motion.div className="big-icon" animate={{ rotate: [0, 4, -4, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
                <AnimatedIcon icon={s.icon} size={54} box={110} />
              </motion.div>
              <div className="big-num">{s.num}</div>
            </TiltCard>

            <div className="svc-info">
              <div className="kicker">{s.tag}</div>
              <h3 className="h3">{s.title}</h3>
              <p className="muted">{s.desc}</p>
              <div className="inc-title">What's included</div>
              <ul className="checks two">
                {s.items.map((it) => <li key={it}><Check size={16} /> {it}</li>)}
              </ul>
              <div className="chips-row">
                {s.tools.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="center-cta">
        <Magnetic><Link to="/contact" className="btn btn-primary">Request a free quote <ArrowRight size={18} /></Link></Magnetic>
      </Reveal>
    </div>
  );
}
