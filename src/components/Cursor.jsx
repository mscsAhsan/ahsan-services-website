import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Custom cursor: precise dot + springy ring + soft red glow + click ripples.
// Only enabled on devices with a real mouse (pointer: fine).
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState("default"); // default | link | text
  const [down, setDown] = useState(false);
  const [ripples, setRipples] = useState([]);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 200, damping: 22, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 200, damping: 22, mass: 0.5 });
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
      if (!t) setMode("default");
      else if (t.matches("input,textarea,select")) setMode("text");
      else setMode("link");
    };
    const dn = (e) => {
      setDown(true);
      const id = Date.now() + Math.random();
      setRipples((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 700);
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
  }, [x, y]);

  if (!enabled) return null;

  const ring = {
    default: { width: 38, height: 38, marginLeft: -19, marginTop: -19, backgroundColor: "rgba(225,29,72,0)" },
    link: { width: 78, height: 78, marginLeft: -39, marginTop: -39, backgroundColor: "rgba(225,29,72,0.16)" },
    text: { width: 4, height: 30, marginLeft: -2, marginTop: -15, backgroundColor: "rgba(255,61,90,0.9)" },
  };

  return (
    <>
      <motion.div className="cursor-glow" style={{ x: gx, y: gy }} />
      <motion.div
        className="cursor-ring"
        style={{ x: rx, y: ry }}
        animate={{ ...ring[mode], scale: down ? 0.8 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
      <motion.div className="cursor-dot" style={{ x, y }} animate={{ scale: mode === "link" ? 0 : down ? 0.6 : 1 }} />
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="cursor-ripple"
          style={{ left: r.x, top: r.y }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        />
      ))}
    </>
  );
}
