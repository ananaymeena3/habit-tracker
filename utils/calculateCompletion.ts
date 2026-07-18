import { Habit, AnalyticsSummary } from "@/types";
import { getLocalDateString, parseLocalDateString, getPastDateStrings, isToday } from "./dateHelpers";
import { calculateOverallStreak } from "./calculateStreak";

/**
 * Calculates today's completion statistics.
 */
export const calculateTodayCompletion = (habits: Habit[]) => {
  if (!habits || habits.length === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }
  
  const todayStr = getLocalDateString();
  const completed = habits.filter((h) => h.history.includes(todayStr)).length;
  const total = habits.length;
  const percentage = Math.round((completed / total) * 100);
  
  return { completed, total, percentage };
};

/**
 * Calculates the total possible active days and completed days for a habit.
 */
export const getHabitCompletionStats = (habit: Habit) => {
  const today = new Date();
  const createdDate = parseLocalDateString(habit.createdAt.split("T")[0]);
  
  // Calculate difference in days (min 1 day for today)
  const diffTime = today.getTime() - createdDate.getTime();
  const diffDays = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
  
  const completed = habit.history.length;
  const rate = Math.round((completed / diffDays) * 100);
  
  return {
    completed,
    possible: diffDays,
    rate: Math.min(100, Math.max(0, rate)),
  };
};

/**
 * Calculates completions for a given historical period (e.g., 7 days or 30 days).
 */
export const calculatePeriodStats = (habits: Habit[], daysCount: number) => {
  const pastDates = getPastDateStrings(daysCount);
  let completed = 0;
  let possible = 0;
  
  const todayStr = getLocalDateString();
  
  pastDates.forEach((dateStr) => {
    habits.forEach((habit) => {
      const habitCreatedStr = habit.createdAt.split("T")[0];
      
      // A habit is "possible" on a date if it was created on or before that date
      // AND that date is not in the future (which pastDates guarantees)
      if (habitCreatedStr <= dateStr) {
        possible++;
        if (habit.history.includes(dateStr)) {
          completed++;
        }
      }
    });
  });
  
  const rate = possible > 0 ? Math.round((completed / possible) * 100) : 0;
  
  return { completed, possible, rate };
};

/**
 * Generates the full analytics summary for the dashboard.
 */
export const generateAnalyticsSummary = (habits: Habit[]): AnalyticsSummary => {
  const totalHabits = habits.length;
  const todayStats = calculateTodayCompletion(habits);
  
  // Overall success rate
  let totalCompleted = 0;
  let totalPossible = 0;
  
  habits.forEach((habit) => {
    const stats = getHabitCompletionStats(habit);
    totalCompleted += stats.completed;
    totalPossible += stats.possible;
  });
  
  const successRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  
  // Streak stats
  const overallStreak = calculateOverallStreak(habits);
  
  // Weekly and Monthly stats
  const weeklySummary = calculatePeriodStats(habits, 7);
  const monthlySummary = calculatePeriodStats(habits, 30);
  
  return {
    totalHabits,
    completedToday: todayStats.completed,
    completionPercentage: todayStats.percentage,
    currentStreak: overallStreak.currentStreak,
    bestStreak: overallStreak.bestStreak,
    successRate,
    weeklySummary,
    monthlySummary,
  };
};
