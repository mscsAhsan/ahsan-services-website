import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

export default function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    // If the stat is already in view on page load, show the final value
    // immediately instead of counting up from 0.
    const el = ref.current;
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        setV(to);
        setInstant(true);
      }
    }
  }, [to]);

  useEffect(() => {
    if (!inView || instant) return;
    const controls = animate(0, to, { duration: 2, ease: "easeOut", onUpdate: (l) => setV(Math.round(l)) });
    return () => controls.stop();
  }, [inView, to, instant]);

  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  );
}
