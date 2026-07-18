"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  percentage: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, className = "" }) => {
  const clampedPercentage = Math.min(100, Math.max(0, isNaN(percentage) ? 0 : percentage));

  return (
    <div className={`w-full bg-muted/50 rounded-full h-[6px] overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-primary rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${clampedPercentage}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
};

export default ProgressBar;
