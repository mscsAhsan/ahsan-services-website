import { motion } from "framer-motion";

// Letter-by-letter reveal. Words never break across lines.
export default function SplitText({ text, className = "", delay = 0 }) {
  let idx = 0;
  return (
    <span className={`split ${className}`} aria-label={text}>
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="word" aria-hidden="true">
          {[...word].map((ch, ci) => (
            <motion.span
              key={ci}
              className="char"
              initial={{ y: "115%", opacity: 0, rotate: 8 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.7, delay: delay + 0.03 * idx++, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch}
            </motion.span>
          ))}
          &nbsp;
        </span>
      ))}
    </span>
  );
}
