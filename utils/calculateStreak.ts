import { Streak, Habit } from "@/types";
import { getLocalDateString, areConsecutiveDays, parseLocalDateString } from "./dateHelpers";

/**
 * Calculates current and best streaks for a single habit based on its history.
 */
export const calculateHabitStreak = (history: string[]): Streak => {
  if (!history || history.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Remove duplicates and sort ascending
  const sortedDates = Array.from(new Set(history)).sort();
  
  let bestStreak = 0;
  
  // Calculate best streak in the history
  let tempStreak = 1;
  bestStreak = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    if (areConsecutiveDays(sortedDates[i - 1], sortedDates[i])) {
      tempStreak++;
    } else {
      bestStreak = Math.max(bestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  bestStreak = Math.max(bestStreak, tempStreak);
  
  // Calculate current streak
  const todayStr = getLocalDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);
  
  const hasCompletedToday = sortedDates.includes(todayStr);
  const hasCompletedYesterday = sortedDates.includes(yesterdayStr);
  
  let currentStreak = 0;
  
  if (hasCompletedToday) {
    // Start tracing back from today
    let count = 0;
    const checkDate = new Date();
    while (true) {
      const checkStr = getLocalDateString(checkDate);
      if (sortedDates.includes(checkStr)) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    currentStreak = count;
  } else if (hasCompletedYesterday) {
    // Today not completed yet, but yesterday was, so streak is still alive.
    // Start tracing back from yesterday
    let count = 0;
    const checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - 1);
    while (true) {
      const checkStr = getLocalDateString(checkDate);
      if (sortedDates.includes(checkStr)) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    currentStreak = count;
  } else {
    // Skipped yesterday and not done today, streak resets
    currentStreak = 0;
  }
  
  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
  };
};

/**
 * Calculates the overall streak for all habits combined.
 * This represents consecutive days where at least one habit was completed.
 */
export const calculateOverallStreak = (habits: Habit[]): Streak => {
  if (!habits || habits.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }
  
  // Gather all unique completed dates from all habits
  const allHistory = habits.flatMap((h) => h.history);
  return calculateHabitStreak(allHistory);
};
