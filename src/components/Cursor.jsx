import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Custom cursor: comet trail + rotating dashed ring + magnetic pull +
// click shockwave + blinking caret on text fields + soft red glow.
// Only enabled on devices with a real mouse (pointer: fine).
// The core follows the mouse instantly; the trail and ring follow on springs.
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState("default"); // default | link | text
  const [down, setDown] = useState(false);
  const [shocks, setShocks] = useState([]);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Comet trail: 5 dots, each on a progressively slower spring.
  const trail = [
    useSpring(x, { stiffness: 900, damping: 40, mass: 0.4 }),
    useSpring(x, { stiffness: 550, damping: 38, mass: 0.5 }),
    useSpring(x, { stiffness: 340, damping: 34, mass: 0.6 }),
    useSpring(x, { stiffness: 210, damping: 30, mass: 0.7 }),
    useSpring(x, { stiffness: 130, damping: 26, mass: 0.8 }),
  ];
  const trailY = [
    useSpring(y, { stiffness: 900, damping: 40, mass: 0.4 }),
    useSpring(y, { stiffness: 550, damping: 38, mass: 0.5 }),
    useSpring(y, { stiffness: 340, damping: 34, mass: 0.6 }),
    useSpring(y, { stiffness: 210, damping: 30, mass: 0.7 }),
    useSpring(y, { stiffness: 130, damping: 26, mass: 0.8 }),
  ];

  // Ring position: its own motion values so it can be magnetically
  // pulled toward the center of whatever interactive element is hovered.
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);
  const ringSX = useSpring(ringX, { stiffness: 260, damping: 24, mass: 0.6 });
  const ringSY = useSpring(ringY, { stiffness: 260, damping: 24, mass: 0.6 });
  const gx = useSpring(x, { stiffness: 60, damping: 20 });
  const gy = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target instanceof Element ? e.target.closest("a,button,[data-cursor],input,textarea,select,label") : null;
      if (!t) {
        setMode("default");
        ringX.set(e.clientX);
        ringY.set(e.clientY);
      } else if (t.matches("input,textarea,select")) {
        setMode("text");
        ringX.set(e.clientX);
        ringY.set(e.clientY);
      } else {
        setMode("link");
        // Magnetic pull: aim the ring partway toward the element center.
        const r = t.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        ringX.set(e.clientX + (cx - e.clientX) * 0.35);
        ringY.set(e.clientY + (cy - e.clientY) * 0.35);
      }
    };
    const dn = (e) => {
      setDown(true);
      const id = Date.now() + Math.random();
      setShocks((s) => [...s, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setShocks((s) => s.filter((p) => p.id !== id)), 800);
    };
    const up = () => setDown(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", dn);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", dn);
      window.removeEventListener("mouseup", up);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y, ringX, ringY]);

  if (!enabled) return null;

  const ring = {
    default: { width: 44, height: 44, marginLeft: -22, marginTop: -22, borderColor: "rgba(255,61,90,0.9)", backgroundColor: "rgba(225,29,72,0)", borderRadius: "50%" },
    link: { width: 62, height: 62, marginLeft: -31, marginTop: -31, borderColor: "rgba(255,61,90,1)", backgroundColor: "rgba(225,29,72,0.18)", borderRadius: "50%" },
    text: { width: 3, height: 30, marginLeft: -1.5, marginTop: -15, borderColor: "rgba(255,61,90,0)", backgroundColor: "rgba(255,61,90,0.95)", borderRadius: "2px" },
  };

  return (
    <>
      <motion.div className="cursor-glow" style={{ x: gx, y: gy }} />
      {trail.map((tx, i) => (
        <motion.div
          key={i}
          className="cursor-trail"
          style={{ x: tx, y: trailY[i], opacity: 0.85 - i * 0.15, scale: 1 - i * 0.16 }}
        />
      ))}
      <motion.div className="cursor-core" style={{ x, y }} animate={{ scale: mode === "link" ? 0 : down ? 0.55 : 1 }} />
      <motion.div
        className={`cursor-ring ${mode === "text" ? "caret" : mode === "link" ? "link" : ""}`}
        style={{ x: ringSX, y: ringSY }}
        animate={{ ...ring[mode], scale: down ? 0.82 : 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
      >
        {mode !== "text" && <span className="cursor-ring-spin" />}
      </motion.div>
      {shocks.map((s) => (
        <motion.span
          key={s.id}
          className="cursor-shockwave"
          style={{ left: s.x, top: s.y }}
          initial={{ scale: 0, opacity: 0.9 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      ))}
    </>
  );
}
