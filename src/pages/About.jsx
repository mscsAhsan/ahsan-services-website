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
          {BRAND.name} is a studio focused on one thing: building intelligent digital products. We design and ship AI-powered web apps, full-stack platforms, machine learning systems, chatbots and automations - from the first sketch to a live product real users can rely on.
        </p>
        <p className="muted">
          The stack is Python, PyTorch and TensorFlow for the AI side, and React, Next.js, Node.js, Flask and FastAPI for the web side, with PostgreSQL underneath. Every project follows the same approach: a working version first, then test, measure and improve.
        </p>
      </Reveal>

      <Reveal>
        <img src="/images/about.jpg" alt="Abstract visual of circuits merging into a neural network" loading="lazy" className="about-img" />
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
