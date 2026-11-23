import { Sparkles } from "lucide-react";
import { services } from "../data";

// Glowing core with the 6 service icons orbiting on two rings (pure CSS animation).
export default function OrbitVisual() {
  const inner = services.slice(0, 3);
  const outer = services.slice(3);
  const place = (list, R, dur, dir) =>
    list.map((s, i) => {
      const a = (360 / list.length) * i;
      return (
        <div key={s.id} className="orbit-item" style={{ "--a": `${a}deg`, "--r": `${R}px` }}>
          <div className="orbit-counter" style={{ animationDuration: `${dur}s`, animationDirection: dir === "rev" ? "normal" : "reverse" }}>
            <span className="orbit-icon" title={s.title} data-cursor>
              <s.icon size={22} strokeWidth={1.8} />
            </span>
          </div>
        </div>
      );
    });

  return (
    <div className="orbit" aria-hidden="true">
      <div className="orbit-glow" />
      <div className="ring ring1" style={{ animationDuration: "26s" }}>{place(inner, 115, 26, "fwd")}</div>
      <div className="ring ring2" style={{ animationDuration: "40s", animationDirection: "reverse" }}>{place(outer, 185, 40, "rev")}</div>
      <div className="orbit-core">
        <span className="core-pulse" />
        <Sparkles size={34} strokeWidth={1.6} />
      </div>
    </div>
  );
}
