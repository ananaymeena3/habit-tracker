"use client";

import React, { useMemo } from "react";
import { Calendar, CheckSquare, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Habit } from "@/types";
import { generateHeatmapData } from "@/utils/generateHeatmap";
import Heatmap from "./Heatmap";

interface HeatmapViewProps {
  habits: Habit[];
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({ habits }) => {
  // Generate stats over the 77 days
  const periodStats = useMemo(() => {
    const data = generateHeatmapData(habits, 77);
    
    let activeDays = 0;
    let perfectDays = 0;
    let totalCompletions = 0;
    let totalPossibleCompletions = 0;
    let sumPercentages = 0;
    let activeDaysWithHabits = 0;

    data.forEach((day) => {
      if (day.completedCount > 0) {
        activeDays++;
      }
      if (day.totalCount > 0) {
        activeDaysWithHabits++;
        sumPercentages += day.percentage;
        totalPossibleCompletions += day.totalCount;
        totalCompletions += day.completedCount;
        
        if (day.completedCount === day.totalCount) {
          perfectDays++;
        }
      }
    });

    const averageRate = activeDaysWithHabits > 0 ? Math.round(sumPercentages / activeDaysWithHabits) : 0;

    return {
      activeDays,
      perfectDays,
      totalCompletions,
      totalPossibleCompletions,
      averageRate,
    };
  }, [habits]);

  return (
    <div className="flex flex-col gap-6 md:pb-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="select-none"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Consistency Grid
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
          Habit Activity Map
        </h2>
      </motion.div>

      {/* Grid Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Heatmap habits={habits} />
      </motion.div>

      {/* History Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Active Days */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="glass-panel p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between h-28 select-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-muted-foreground">Active Days</span>
            <div className="p-1.5 rounded-lg bg-muted text-foreground">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">
              {periodStats.activeDays} <span className="text-xs font-normal text-muted-foreground">/ 77d</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Days with at least one complete</p>
          </div>
        </motion.div>

        {/* Perfect Days */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-panel p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between h-28 select-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-muted-foreground">Perfect Days</span>
            <div className="p-1.5 rounded-lg bg-muted text-foreground">
              <Sparkles className="w-4 h-4 text-success" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">
              {periodStats.perfectDays} <span className="text-xs font-normal text-muted-foreground">days</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Days with 100% completion rate</p>
          </div>
        </motion.div>

        {/* Total Completions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="glass-panel p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between h-28 select-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-muted-foreground">Completions</span>
            <div className="p-1.5 rounded-lg bg-muted text-foreground">
              <CheckSquare className="w-4 h-4 text-warning" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">
              {periodStats.totalCompletions} <span className="text-xs font-normal text-muted-foreground">times</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Total habit completions logged</p>
          </div>
        </motion.div>

        {/* Average Rate */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-panel p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between h-28 select-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-muted-foreground">Average Rate</span>
            <div className="p-1.5 rounded-lg bg-muted text-foreground">
              <Zap className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">
              {periodStats.averageRate}%
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Average completions over period</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeatmapView;
