"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  iconColorClass?: string;
  delayIndex?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  iconColorClass = "text-primary",
  delayIndex = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delayIndex * 0.05, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass-panel rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32 relative overflow-hidden group select-none"
    >
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 bg-radial from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-start justify-between">
        <span className="text-[13px] font-medium text-muted-foreground">{title}</span>
        <div className={`p-2 rounded-xl bg-muted/40 group-hover:bg-muted/80 transition-colors duration-200`}>
          <Icon className={`w-[18px] h-[18px] ${iconColorClass}`} />
        </div>
      </div>
      
      <div className="mt-2">
        <div className="text-2xl font-bold tracking-tight text-foreground font-sans">
          {value}
        </div>
        <p className="text-[12px] text-muted-foreground mt-0.5 font-medium">
          {subtext}
        </p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
