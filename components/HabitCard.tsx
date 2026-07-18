"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Edit2, Trash2, CalendarDays } from "lucide-react";
import { Habit } from "@/types";
import { calculateHabitStreak } from "@/utils/calculateStreak";
import { getHabitCompletionStats } from "@/utils/calculateCompletion";
import { getLocalDateString } from "@/utils/dateHelpers";
import HabitCheckbox from "./HabitCheckbox";

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggle,
  onRename,
  onDelete,
}) => {
  const todayStr = getLocalDateString();
  const isCompletedToday = habit.history.includes(todayStr);

  // Calculate stats
  const { currentStreak, bestStreak } = useMemo(() => {
    return calculateHabitStreak(habit.history);
  }, [habit.history]);

  const { rate } = useMemo(() => {
    return getHabitCompletionStats(habit);
  }, [habit]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`glass-panel rounded-2xl p-4 flex items-center justify-between group select-none relative overflow-hidden transition-all duration-300 ${
        isCompletedToday ? "bg-muted/10! border-success/20!" : "hover:border-foreground/10"
      }`}
    >
      {/* Background glow when completed */}
      {isCompletedToday && (
        <div className="absolute inset-0 bg-success/2 dark:bg-success/2 pointer-events-none" />
      )}

      {/* Left Content: Emoji, Info */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0 mr-4">
        {/* Emoji Badge */}
        <div
          className={`w-11 h-11 flex items-center justify-center rounded-xl text-lg shrink-0 transition-colors duration-200 ${
            isCompletedToday
              ? "bg-success-muted text-success"
              : "bg-muted/60 text-foreground dark:bg-muted/30"
          }`}
        >
          {habit.emoji}
        </div>

        {/* Text Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4
              className={`font-semibold text-[14px] leading-tight truncate transition-colors duration-250 ${
                isCompletedToday ? "text-foreground/70 line-through decoration-muted-foreground/30" : "text-foreground"
              }`}
            >
              {habit.name}
            </h4>
            
            {/* Inline Action Buttons (Hidden by default, shown on card hover) */}
            <div className="hidden md:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1 shrink-0">
              <button
                onClick={() => onRename(habit.id, habit.name)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 cursor-pointer"
                title="Rename habit"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => onDelete(habit.id)}
                className="p-1 rounded-md text-muted-foreground hover:text-warning hover:bg-warning/10 transition-colors duration-150 cursor-pointer"
                title="Delete habit"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1 font-medium truncate">
            <span className="flex items-center gap-0.5">
              <CalendarDays className="w-3 h-3 text-muted-foreground/60" />
              {rate}% rate
            </span>
            <span className="text-muted-foreground/30">•</span>
            <span>Best: {bestStreak}d</span>
          </div>
        </div>
      </div>

      {/* Right Content: Streak Flame & Checkbox */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Streak Indicator */}
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold select-none transition-colors duration-250 ${
            currentStreak > 0
              ? "text-warning bg-warning/8 dark:bg-warning/12"
              : "text-muted-foreground/40 bg-muted/20"
          }`}
          title={`Current Streak: ${currentStreak} days`}
        >
          <Flame className={`w-3.5 h-3.5 ${currentStreak > 0 ? "fill-warning" : "opacity-40"}`} />
          <span className="text-[11px]">{currentStreak}</span>
        </div>

        {/* Checkbox Toggle */}
        <HabitCheckbox checked={isCompletedToday} onChange={() => onToggle(habit.id)} />

        {/* Mobile Action Buttons (Visible only on mobile inside the cards to be accessible without hover) */}
        <div className="flex md:hidden flex-col gap-1.5 ml-1 select-none shrink-0 border-l border-border/40 pl-2.5">
          <button
            onClick={() => onRename(habit.id, habit.name)}
            className="p-1 text-muted-foreground active:text-foreground cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="p-1 text-muted-foreground active:text-warning cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HabitCard;
