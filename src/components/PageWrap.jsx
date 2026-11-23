import { motion } from "framer-motion";

const COLS = 6;
const ease = [0.76, 0, 0.24, 1];

// Stripes that REVEAL the new page (shrink away from the top)
function EnterStripes() {
  return (
    <div className="stripes" aria-hidden="true">
      {Array.from({ length: COLS }).map((_, i) => (
        <motion.div
          key={i}
          className={`stripe ${i % 2 ? "alt" : ""}`}
          style={{ transformOrigin: "top" }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.7, delay: 0.05 * i, ease }}
        />
      ))}
    </div>
  );
}

// Stripes that COVER the old page when it leaves (grow from the bottom)
function ExitStripes() {
  return (
    <div className="stripes" aria-hidden="true">
      {Array.from({ length: COLS }).map((_, i) => (
        <motion.div
          key={i}
          className={`stripe ${i % 2 ? "alt" : ""}`}
          style={{ transformOrigin: "bottom" }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1, transition: { duration: 0.55, delay: 0.05 * i, ease } }}
        />
      ))}
    </div>
  );
}

export default function PageWrap({ children }) {
  return (
    <>
      <EnterStripes />
      <ExitStripes />
      <motion.main
        className="page"
        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] } }}
        exit={{ opacity: 0, y: -20, transition: { duration: 0.35 } }}
      >
        {children}
      </motion.main>
    </>
  );
}
