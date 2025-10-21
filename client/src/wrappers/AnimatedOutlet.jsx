// src/wrappers/AnimatedOutlet.jsx
import { useOutlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export default function AnimatedOutlet() {
  const location = useLocation();
  const element = useOutlet();

  // Scroll instantly to top whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          opacity: { duration: 0.25 }, // old page fades out faster
          default: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }, // new page fades in slower
        }}
        style={{ minHeight: "100vh", background: "var(--body-bg)" }}
      >
        {element}
      </motion.div>
    </AnimatePresence>
  );
}
