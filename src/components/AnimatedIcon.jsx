import { motion } from "framer-motion";

// Icon inside a glowing box: floats continuously, wiggles + glows on hover.
export default function AnimatedIcon({ icon: Icon, size = 26, box = 56, delay = 0 }) {
  return (
    <motion.span
      className="aicon"
      style={{ width: box, height: box }}
      animate={{ y: [0, -5, 0] }}
      transition={{ y: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay }, default: { duration: 0.5 } }}
      whileHover={{ rotate: [0, -14, 14, -8, 0], scale: 1.18 }}
    >
      <span className="aicon-pulse" />
      <Icon size={size} strokeWidth={1.8} />
    </motion.span>
  );
}
