import { motion } from "framer-motion";

interface ExpeditionBackdropProps {
  className?: string;
}

export const ExpeditionBackdrop = ({ className }: ExpeditionBackdropProps) => (
  <motion.div
    aria-hidden="true"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: [20, 14, 20] }}
    transition={{
      opacity: { duration: 0.55 },
      y: { duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
    }}
    className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
  >
    <motion.div
      animate={{ x: [0, 8, 0], y: [0, -6, 0], rotate: [0, 3, 0] }}
      transition={{
        duration: 18,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      className="absolute -left-8 top-10 h-36 w-36 rounded-full bg-color-ochre/15 blur-sm"
    />
    <motion.div
      animate={{ x: [0, -10, 0], y: [0, 8, 0], rotate: [0, -2, 0] }}
      transition={{
        duration: 20,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      className="absolute right-0 top-1/4 h-44 w-44 rounded-full bg-color-terracotta/15 blur-sm"
    />
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
      transition={{
        duration: 16,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      className="absolute bottom-6 left-1/4 text-6xl opacity-30"
    >
      🧭
    </motion.div>
    <motion.div
      animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
      transition={{
        duration: 19,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      className="absolute bottom-8 right-1/4 text-5xl opacity-25"
    >
      🗺️
    </motion.div>
  </motion.div>
);

