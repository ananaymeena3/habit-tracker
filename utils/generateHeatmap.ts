import { Habit } from "@/types";
import { getPastDateStrings, parseLocalDateString } from "./dateHelpers";

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  completedCount: number;
  totalCount: number;
  percentage: number;
  level: 0 | 1 | 2 | 3 | 4;
}

/**
 * Generates completion data for the last `daysCount` (default 77) days.
 */
export const generateHeatmapData = (habits: Habit[], daysCount = 77): HeatmapDay[] => {
  const dateStrings = getPastDateStrings(daysCount);
  
  return dateStrings.map((dateStr) => {
    let completedCount = 0;
    let totalCount = 0;
    
    habits.forEach((habit) => {
      const habitCreatedStr = habit.createdAt.split("T")[0];
      
      // Habit is counted in the total possible habits if it was created on or before this day
      if (habitCreatedStr <= dateStr) {
        totalCount++;
        if (habit.history.includes(dateStr)) {
          completedCount++;
        }
      }
    });
    
    // If no habits existed yet on this day, we default totalCount to 0
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    // Map percentage to 5 intensity levels (0 to 4)
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (percentage > 0) {
      if (percentage <= 25) level = 1;
      else if (percentage <= 50) level = 2;
      else if (percentage <= 75) level = 3;
      else level = 4;
    }
    
    return {
      date: dateStr,
      completedCount,
      totalCount,
      percentage,
      level,
    };
  });
};

/**
 * Groups a flat array of 77 HeatmapDays into columns (weeks) of 7 days.
 * This is useful for rendering a GitHub-like contribution grid.
 */
export const chunkHeatmapIntoWeeks = (data: HeatmapDay[]): HeatmapDay[][] => {
  const weeks: HeatmapDay[][] = [];
  const chunkSize = 7;
  
  // Note: To align days of the week, we can just chunk them by 7.
  // Since we take exactly 77 days, this gives exactly 11 weeks.
  for (let i = 0; i < data.length; i += chunkSize) {
    weeks.push(data.slice(i, i + chunkSize));
  }
  
  return weeks;
};
