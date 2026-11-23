import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BRAND } from "../config";

export default function Preloader({ onDone }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += Math.random() * 9 + 3;
      if (v >= 100) {
        v = 100;
        clearInterval(id);
        setTimeout(onDone, 350);
      }
      setN(Math.floor(v));
    }, 80);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <motion.div
      className="preloader"
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
    >
      <motion.div className="pre-logo" animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        {BRAND.short}
      </motion.div>
      <div className="pre-name">{BRAND.name}</div>
      <div className="pre-bar">
        <motion.div className="pre-fill" style={{ width: `${n}%` }} />
      </div>
      <div className="pre-num">{n}%</div>
    </motion.div>
  );
}
