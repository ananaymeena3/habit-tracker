"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: React.ReactNode;
  visible: boolean;
  x: number;
  y: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, visible, x, y }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: -8 }}
          exit={{ opacity: 0, scale: 0.95, y: -4 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: "fixed",
            left: x,
            top: y,
            transform: "translateX(-50%) translateY(-100%)",
          }}
          className="z-50 pointer-events-none px-3 py-2 text-[11px] font-medium text-white dark:text-neutral-100 bg-neutral-900/95 dark:bg-neutral-900/95 border border-neutral-800 dark:border-neutral-800 rounded-lg shadow-lg backdrop-blur-md max-w-xs text-center"
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Tooltip;
