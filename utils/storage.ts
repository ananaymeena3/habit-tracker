import { Habit } from "@/types";
import { getLocalDateString, getPastDateStrings } from "./dateHelpers";

const HABITS_KEY = "habit-tracker-habits";

// 16 Preset Habits
const PRESET_HABITS_DEFINITIONS = [
  { emoji: "🏋️", name: "Exercise" },
  { emoji: "📚", name: "Read" },
  { emoji: "🧘", name: "Meditate" },
  { emoji: "💧", name: "Drink Water" },
  { emoji: "💻", name: "Code" },
  { emoji: "🧠", name: "Learn Something" },
  { emoji: "😴", name: "Sleep Early" },
  { emoji: "🥗", name: "Healthy Food" },
  { emoji: "🚶", name: "Walk" },
  { emoji: "✍️", name: "Journal" },
  { emoji: "🎵", name: "Practice Music" },
  { emoji: "📖", name: "Study" },
  { emoji: "🧹", name: "Clean Room" },
  { emoji: "🧎", name: "Stretch" },
  { emoji: "🪥", name: "Skin Care" },
  { emoji: "☀️", name: "Wake Early" },
];

/**
 * Generates the initial 16 preset habits.
 * Seeds some realistic completed dates over the past 14 days so the dashboard and heatmap look alive on first run.
 */
export const generateInitialHabits = (): Habit[] => {
  const past14Days = getPastDateStrings(14);
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  const createdAtStr = tenDaysAgo.toISOString();

  return PRESET_HABITS_DEFINITIONS.map((def, index) => {
    const history: string[] = [];
    
    // Seed completions:
    // - Habits 0-3 (Exercise, Read, Meditate, Water): High completion rate (70%)
    // - Habits 4-7 (Code, Learn, Sleep, Food): Medium completion rate (50%)
    // - Habits 8-11 (Walk, Journal, Music, Study): Low completion rate (30%)
    // - Habits 12-15 (Clean, Stretch, Skin, Wake): Sparse completion rate (20%)
    
    let rate = 0.5;
    if (index < 4) rate = 0.75;
    else if (index < 8) rate = 0.55;
    else if (index < 12) rate = 0.35;
    else rate = 0.20;

    past14Days.forEach((dateStr, dayIndex) => {
      // Avoid completing today automatically to let user interact with it
      const isTodayDate = dayIndex === past14Days.length - 1;
      
      // Also, let's create a streak for the first 3 habits ending yesterday
      if (index < 3 && dayIndex >= past14Days.length - 5 && dayIndex < past14Days.length - 1) {
        history.push(dateStr);
      } else if (!isTodayDate && Math.random() < rate) {
        history.push(dateStr);
      }
    });

    return {
      id: `preset-${def.name.toLowerCase().replace(/\s+/g, "-")}`,
      name: def.name,
      emoji: def.emoji,
      createdAt: createdAtStr,
      history,
    };
  });
};

/**
 * Loads habits from localStorage. If none exist, seeds the 16 preset habits and saves them.
 */
export const getStoredHabits = (): Habit[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const raw = localStorage.getItem(HABITS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    
    // Start empty on first run
    const initialHabits: Habit[] = [];
    localStorage.setItem(HABITS_KEY, JSON.stringify(initialHabits));
    return initialHabits;
  } catch (error) {
    console.error("Error loading habits from localStorage", error);
    return [];
  }
};

/**
 * Saves habits to localStorage.
 */
export const setStoredHabits = (habits: Habit[]): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error("Error saving habits to localStorage", error);
  }
};

/**
 * Resets all habits back to their initial seeded state.
 */
export const resetHabitsData = (): Habit[] => {
  if (typeof window === "undefined") return [];
  
  const initialHabits = generateInitialHabits();
  setStoredHabits(initialHabits);
  return initialHabits;
};

/**
 * Completely clears localStorage habits key (fresh empty start).
 */
export const clearAllHabitsData = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HABITS_KEY);
};
