import Reveal from "./Reveal";

export default function SectionHead({ kicker, title, sub, center = false }) {
  return (
    <Reveal className={`sec-head ${center ? "center" : ""}`}>
      <div className="kicker">{kicker}</div>
      <h2 className="h2">{title}</h2>
      {sub && <p className="sub">{sub}</p>}
    </Reveal>
  );
}
