import { Zap, Shield, Layers, HeartHandshake } from "lucide-react";
import { BRAND } from "../config";
import { stats } from "../data";
import SectionHead from "../components/SectionHead";
import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";
import AnimatedIcon from "../components/AnimatedIcon";
import Counter from "../components/Counter";

const values = [
  { icon: Layers, t: "Engineering-first", d: "Clean, scalable code and modern architecture built to last." },
  { icon: Zap, t: "AI built in", d: "Practical machine learning and automation, not buzzwords." },
  { icon: Shield, t: "Design that converts", d: "Premium visuals tuned for engagement and results." },
  { icon: HeartHandshake, t: "Transparent process", d: "Clear timelines, regular updates and honest pricing." },
];

export default function About() {
  return (
    <div className="container page-top">
      <SectionHead kicker="About us" title="Who we are" />
      <Reveal className="about-text">
        <p className="lead">
          {BRAND.name} is a digital studio that combines engineering, creativity and research. We help startups, businesses and institutions launch smarter products, grow their audience and make decisions backed by data.
        </p>
        <p className="muted">[Replace this with your own story, mission and experience in src/pages/About.jsx.]</p>
      </Reveal>

      <div className="stats section">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={0.08 * i} className="stat">
            <div className="stat-num"><Counter to={s.to} suffix={s.suffix} /></div>
            <div className="muted">{s.label}</div>
          </Reveal>
        ))}
      </div>

      <SectionHead kicker="Our values" title="Why clients choose us" />
      <div className="grid-4">
        {values.map((v, i) => (
          <Reveal key={v.t} delay={0.1 * i}>
            <TiltCard className="val">
              <AnimatedIcon icon={v.icon} delay={i * 0.3} />
              <h4>{v.t}</h4>
              <p className="muted">{v.d}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
