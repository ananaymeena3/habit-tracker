export interface Habit {
  id: string;
  name: string;
  emoji: string;
  createdAt: string; // ISO date string
  history: string[]; // Array of YYYY-MM-DD strings representing completed dates
}

export interface Streak {
  currentStreak: number;
  bestStreak: number;
}

export interface HabitStreak extends Streak {
  habitId: string;
}

export interface OverallStreak {
  currentStreak: number;
  bestStreak: number;
}

export interface DayCompletion {
  date: string; // YYYY-MM-DD
  completedCount: number;
  totalCount: number;
  percentage: number; // 0 to 100
}

export interface AnalyticsSummary {
  totalHabits: number;
  completedToday: number;
  completionPercentage: number;
  currentStreak: number;
  bestStreak: number;
  successRate: number; // overall completed / overall possible
  weeklySummary: {
    completed: number;
    possible: number;
    rate: number;
  };
  monthlySummary: {
    completed: number;
    possible: number;
    rate: number;
  };
}

export interface Quote {
  text: string;
  author: string;
}

export type SortOption = "alphabetical" | "newest" | "streak" | "completed";
