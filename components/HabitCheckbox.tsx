"use client";

import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface HabitCheckboxProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
}

export const HabitCheckbox: React.FC<HabitCheckboxProps> = ({
  checked,
  onChange,
  className = "",
}) => {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={(e) => {
        e.stopPropagation(); // Avoid triggering any container clicks
        onChange();
      }}
      className={`relative w-[28px] h-[28px] rounded-[9px] flex items-center justify-center border-[2px] transition-all duration-250 cursor-pointer outline-hidden select-none ${
        checked
          ? "bg-success border-success text-primary-foreground shadow-sm shadow-success/10"
          : "border-muted-foreground/20 hover:border-muted-foreground/45 bg-muted/20 hover:bg-muted/40"
      } ${className}`}
      aria-label={checked ? "Mark habit incomplete" : "Mark habit complete"}
    >
      {/* Ripple/Glow on Complete */}
      {checked && (
        <motion.span
          layoutId="checkbox-active-ripple"
          className="absolute inset-0 rounded-[7px] bg-success/20 -z-10 animate-ping"
          style={{ animationDuration: "1s" }}
        />
      )}
      
      <motion.div
        initial={false}
        animate={checked ? "checked" : "unchecked"}
        variants={{
          checked: { scale: 1, opacity: 1 },
          unchecked: { scale: 0.6, opacity: 0 },
        }}
        transition={{ type: "spring", stiffness: 500, damping: 24 }}
        className="flex items-center justify-center text-white"
      >
        <Check className="w-[15px] h-[15px] stroke-[3.5px]" />
      </motion.div>
    </motion.button>
  );
};

export default HabitCheckbox;
