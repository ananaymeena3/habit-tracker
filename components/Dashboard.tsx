"use client";

import React, { useMemo } from "react";
import { CheckCircle2, Flame, Trophy, Percent, Quote as QuoteIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Habit, AnalyticsSummary, SortOption } from "@/types";
import { getLocalDateString, formatDateFriendly } from "@/utils/dateHelpers";
import getDailyQuote from "@/utils/quotes";
import StatsCard from "./StatsCard";
import ProgressBar from "./ProgressBar";
import HabitList from "./HabitList";

interface DashboardProps {
  habits: Habit[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  analytics: AnalyticsSummary;
  onToggle: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  habits,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  analytics,
  onToggle,
  onRename,
  onDelete,
  onAddClick,
  setActiveTab,
}) => {
  const todayStr = useMemo(() => formatDateFriendly(getLocalDateString(), true), []);
  const quote = useMemo(() => getDailyQuote(), []);

  return (
    <div className="flex flex-col gap-6 md:pb-8">
      {/* Welcome & Date / Quote Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
      >
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {todayStr}
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
            Crush Your Habits
          </h2>
        </div>

        {/* Motivational Quote */}
        <div className="glass-panel py-3 px-4 rounded-2xl max-w-md border border-border flex items-start gap-2.5 shadow-xs relative overflow-hidden group">
          <QuoteIcon className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] leading-relaxed font-medium text-foreground italic">
              "{quote.text}"
            </p>
            <span className="text-[9px] font-semibold text-muted-foreground mt-1 block">
              — {quote.author}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Progress"
          value={`${analytics.completionPercentage}%`}
          subtext={`${analytics.completedToday} of ${analytics.totalHabits} completed`}
          icon={CheckCircle2}
          iconColorClass="text-success"
          delayIndex={0}
        />
        <StatsCard
          title="Current Streak"
          value={`${analytics.currentStreak} days`}
          subtext="Consecutive active days"
          icon={Flame}
          iconColorClass="text-warning"
          delayIndex={1}
        />
        <StatsCard
          title="Best Streak"
          value={`${analytics.bestStreak} days`}
          subtext="Your overall record"
          icon={Trophy}
          iconColorClass="text-[#ffd700]"
          delayIndex={2}
        />
        <StatsCard
          title="Success Rate"
          value={`${analytics.successRate}%`}
          subtext="All-time completions"
          icon={Percent}
          iconColorClass="text-primary"
          delayIndex={3}
        />
      </div>

      {/* Progress Bar Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-panel p-5 rounded-2xl border border-border shadow-xs select-none"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-foreground">Daily Completion Goal</span>
          <span className="text-xs font-bold text-success">{analytics.completionPercentage}%</span>
        </div>
        <ProgressBar percentage={analytics.completionPercentage} className="h-2" />
        <div className="flex items-center justify-between mt-2.5 text-[10px] text-muted-foreground font-semibold">
          <span>0%</span>
          {analytics.completionPercentage === 100 ? (
            <span className="text-success font-bold flex items-center gap-1">
              🎉 100% Completed! Today is checked off!
            </span>
          ) : (
            <span>
              Need {analytics.totalHabits - analytics.completedToday} more to finish today
            </span>
          )}
          <span>100%</span>
        </div>
      </motion.div>

      {/* Habits List Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center justify-between select-none">
          <h3 className="font-bold text-base text-foreground tracking-tight">Today's Habits</h3>
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {habits.length} Habits Listed
          </span>
        </div>

        <HabitList
          habits={habits}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onToggle={onToggle}
          onRename={onRename}
          onDelete={onDelete}
          onAddClick={onAddClick}
        />
      </motion.div>
    </div>
  );
};

export default Dashboard;
