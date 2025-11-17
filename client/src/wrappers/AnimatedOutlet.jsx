// src/wrappers/AnimatedOutlet.jsx
import { useOutlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export default function AnimatedOutlet() {
  const location = useLocation();
  const element = useOutlet();

  // scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const noAnimationRoutes = ["/login", "/signup"];

  const shouldAnimate = !noAnimationRoutes.includes(location.pathname);

  if (!shouldAnimate) {
    // NO ANIMATION, RETURN DIRECT CHILD
    return <>{element}</>;
  }

  // NORMAL ANIMATED ROUTES
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          opacity: { duration: 0.25 },
          default: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
        }}
      >
        {element}
      </motion.div>
    </AnimatePresence>
  );
}
