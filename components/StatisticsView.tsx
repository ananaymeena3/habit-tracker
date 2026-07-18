"use client";

import React, { useMemo } from "react";
import { BarChart3, TrendingUp, Calendar, Zap, CheckCircle2, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { Habit, AnalyticsSummary } from "@/types";
import { getHabitCompletionStats } from "@/utils/calculateCompletion";
import { calculateHabitStreak } from "@/utils/calculateStreak";
import ProgressBar from "./ProgressBar";

interface StatisticsViewProps {
  habits: Habit[];
  analytics: AnalyticsSummary;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ habits, analytics }) => {
  // Compute the habits sorted by success rate (highest first) for the breakdown table
  const habitsBreakdown = useMemo(() => {
    return habits.map((habit) => {
      const { rate, completed, possible } = getHabitCompletionStats(habit);
      const { currentStreak, bestStreak } = calculateHabitStreak(habit.history);
      
      return {
        id: habit.id,
        name: habit.name,
        emoji: habit.emoji,
        rate,
        completed,
        possible,
        currentStreak,
        bestStreak,
      };
    }).sort((a, b) => b.rate - a.rate);
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
          Analytics & Insights
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
          Performance Breakdown
        </h2>
      </motion.div>

      {/* Comparison Cards: Weekly vs Monthly */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weekly Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-panel p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between select-none"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Weekly Summary (Last 7 Days)
              </span>
              <span className="text-xs font-bold text-primary">{analytics.weeklySummary.rate}%</span>
            </div>
            
            <div className="text-2xl font-bold text-foreground mt-1">
              {analytics.weeklySummary.completed}{" "}
              <span className="text-xs font-medium text-muted-foreground">
                of {analytics.weeklySummary.possible} check-ins
              </span>
            </div>
            
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Completed {analytics.weeklySummary.completed} tasks out of all possible active habits in the last 7 days.
            </p>
          </div>
          
          <div className="mt-4">
            <ProgressBar percentage={analytics.weeklySummary.rate} className="h-1.5" />
          </div>
        </motion.div>

        {/* Monthly Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="glass-panel p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between select-none"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Monthly Summary (Last 30 Days)
              </span>
              <span className="text-xs font-bold text-success">{analytics.monthlySummary.rate}%</span>
            </div>
            
            <div className="text-2xl font-bold text-foreground mt-1">
              {analytics.monthlySummary.completed}{" "}
              <span className="text-xs font-medium text-muted-foreground">
                of {analytics.monthlySummary.possible} check-ins
              </span>
            </div>
            
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Completed {analytics.monthlySummary.completed} tasks out of all possible active habits in the last 30 days.
            </p>
          </div>
          
          <div className="mt-4">
            <ProgressBar percentage={analytics.monthlySummary.rate} className="h-1.5" />
          </div>
        </motion.div>
      </div>

      {/* Habit Breakdown Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass-panel rounded-2xl border border-border overflow-hidden shadow-xs flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-border select-none">
          <h3 className="font-bold text-sm text-foreground">Habit Consistency Leaderboard</h3>
          <p className="text-xs text-muted-foreground">Detailed metrics of each habit sorted by completion rate</p>
        </div>

        {/* Table/List */}
        <div className="overflow-x-auto select-none">
          {habitsBreakdown.length > 0 ? (
            <div className="min-w-full divide-y divide-border">
              {/* Table Header */}
              <div className="bg-muted/30 px-5 py-2.5 grid grid-cols-12 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span className="col-span-5 sm:col-span-6">Habit</span>
                <span className="col-span-3 sm:col-span-2 text-center">Success Rate</span>
                <span className="col-span-2 text-center">Streak</span>
                <span className="col-span-2 text-center">Best</span>
              </div>
              
              {/* Table Body */}
              <div className="divide-y divide-border/60">
                {habitsBreakdown.map((item) => (
                  <div key={item.id} className="px-5 py-3.5 grid grid-cols-12 text-xs items-center hover:bg-muted/15 transition-colors duration-150">
                    {/* Habit Info */}
                    <div className="col-span-5 sm:col-span-6 flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{item.emoji}</span>
                      <span className="font-semibold text-foreground truncate">{item.name}</span>
                    </div>

                    {/* Success Rate */}
                    <div className="col-span-3 sm:col-span-2 flex flex-col items-center">
                      <span className="font-bold text-foreground">{item.rate}%</span>
                      <span className="text-[9px] text-muted-foreground font-medium">
                        {item.completed}/{item.possible}
                      </span>
                    </div>

                    {/* Current Streak */}
                    <div className="col-span-2 flex items-center justify-center gap-0.5 font-bold text-warning">
                      <Flame className="w-3.5 h-3.5 fill-warning shrink-0" />
                      <span>{item.currentStreak}d</span>
                    </div>

                    {/* Best Streak */}
                    <div className="col-span-2 flex items-center justify-center gap-0.5 font-bold text-foreground/80">
                      <span>{item.bestStreak}d</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center select-none">
              <BarChart3 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="font-semibold text-foreground text-sm">No analytics available</p>
              <p className="text-xs text-muted-foreground">Add and complete some habits to populate statistics.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StatisticsView;
