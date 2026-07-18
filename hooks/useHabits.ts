import { useState, useEffect, useMemo, useCallback } from "react";
import { Habit, SortOption, AnalyticsSummary } from "@/types";
import { getStoredHabits, setStoredHabits, resetHabitsData, generateInitialHabits } from "@/utils/storage";
import { getLocalDateString } from "@/utils/dateHelpers";
import { calculateHabitStreak } from "@/utils/calculateStreak";
import { generateAnalyticsSummary } from "@/utils/calculateCompletion";

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isMounted, setIsMounted] = useState(false);
  const [justCompletedAll, setJustCompletedAll] = useState(false);

  // Initialize habits on client mount
  useEffect(() => {
    setIsMounted(true);
    setHabits(getStoredHabits());
  }, []);

  // Save habits to storage whenever they change
  const saveHabits = useCallback((updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    setStoredHabits(updatedHabits);
  }, []);

  // CRUD: Toggle today's completion for a habit
  const toggleHabit = useCallback((id: string) => {
    const todayStr = getLocalDateString();
    
    // Check if toggling will result in all habits being completed today
    let allCompletedBeforeToggle = false;
    let allCompletedAfterToggle = false;

    setHabits((prevHabits) => {
      // Find habit
      const targetHabit = prevHabits.find((h) => h.id === id);
      if (!targetHabit) return prevHabits;

      const isCompleted = targetHabit.history.includes(todayStr);
      let updatedHistory = [...targetHabit.history];

      if (isCompleted) {
        // Uncheck: remove date
        updatedHistory = updatedHistory.filter((d) => d !== todayStr);
      } else {
        // Check: add date
        updatedHistory.push(todayStr);
      }

      const updatedHabits = prevHabits.map((h) =>
        h.id === id ? { ...h, history: updatedHistory } : h
      );

      // Check if all habits are completed today after this toggle
      const total = updatedHabits.length;
      const completed = updatedHabits.filter((h) => h.history.includes(todayStr)).length;
      
      if (total > 0 && completed === total && !isCompleted) {
        // Trigger confetti!
        setJustCompletedAll(true);
      }

      // Persist to storage
      setStoredHabits(updatedHabits);
      return updatedHabits;
    });
  }, []);

  // CRUD: Add new habit
  const addHabit = useCallback((name: string, emoji = "✨") => {
    const trimmedName = name.trim();
    if (!trimmedName) return { success: false, error: "Habit name cannot be empty." };

    let success = true;
    let errorMsg = "";

    setHabits((prevHabits) => {
      const isDuplicate = prevHabits.some(
        (h) => h.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (isDuplicate) {
        success = false;
        errorMsg = "A habit with this name already exists.";
        return prevHabits;
      }

      const newHabit: Habit = {
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: trimmedName,
        emoji: emoji || "✨",
        createdAt: new Date().toISOString(),
        history: [],
      };

      const updatedHabits = [newHabit, ...prevHabits];
      setStoredHabits(updatedHabits);
      return updatedHabits;
    });

    return { success, error: errorMsg };
  }, []);

  // CRUD: Rename habit
  const renameHabit = useCallback((id: string, newName: string) => {
    const trimmedName = newName.trim();
    if (!trimmedName) return { success: false, error: "Habit name cannot be empty." };

    let success = true;
    let errorMsg = "";

    setHabits((prevHabits) => {
      const isDuplicate = prevHabits.some(
        (h) => h.id !== id && h.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (isDuplicate) {
        success = false;
        errorMsg = "A habit with this name already exists.";
        return prevHabits;
      }

      const updatedHabits = prevHabits.map((h) =>
        h.id === id ? { ...h, name: trimmedName } : h
      );
      setStoredHabits(updatedHabits);
      return updatedHabits;
    });

    return { success, error: errorMsg };
  }, []);

  // CRUD: Delete habit
  const deleteHabit = useCallback((id: string) => {
    setHabits((prevHabits) => {
      const updatedHabits = prevHabits.filter((h) => h.id !== id);
      setStoredHabits(updatedHabits);
      return updatedHabits;
    });
  }, []);

  // Reset data to initial presets
  const resetAll = useCallback(() => {
    const initial = resetHabitsData();
    setHabits(initial);
  }, []);

  // Clear everything (start completely empty)
  const clearAll = useCallback(() => {
    setHabits([]);
    setStoredHabits([]);
  }, []);

  // Export as JSON string
  const exportData = useCallback(() => {
    try {
      const dataStr = JSON.stringify(habits, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `habits_backup_${getLocalDateString()}.json`;
      
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
      return true;
    } catch (e) {
      console.error("Export data failed", e);
      return false;
    }
  }, [habits]);

  // Import JSON string data
  const importData = useCallback((jsonData: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!Array.isArray(parsed)) {
        return { success: false, error: "Imported data must be an array of habits." };
      }

      // Basic validation of fields
      const isValid = parsed.every(
        (item: any) =>
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          typeof item.emoji === "string" &&
          typeof item.createdAt === "string" &&
          Array.isArray(item.history)
      );

      if (!isValid) {
        return {
          success: false,
          error: "Invalid file format. Habits are missing required fields.",
        };
      }

      // Successful validation, merge/overwrite
      saveHabits(parsed);
      return { success: true };
    } catch (e) {
      console.error("Import data failed", e);
      return { success: false, error: "Failed to parse file. Ensure it is valid JSON." };
    }
  }, [saveHabits]);

  // Derived State: Filtered & Sorted habits
  const filteredAndSortedHabits = useMemo(() => {
    // 1. Filter by search query
    let result = habits.filter((h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 2. Sort by option
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return a.name.localeCompare(b.name);
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "streak": {
          const streakA = calculateHabitStreak(a.history).currentStreak;
          const streakB = calculateHabitStreak(b.history).currentStreak;
          return streakB - streakA;
        }
        case "completed": {
          return b.history.length - a.history.length;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [habits, searchQuery, sortBy]);

  // Derived State: Live Analytics
  const analytics: AnalyticsSummary = useMemo(() => {
    return generateAnalyticsSummary(habits);
  }, [habits]);

  return {
    habits: filteredAndSortedHabits,
    rawHabits: habits,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    isMounted,
    analytics,
    justCompletedAll,
    setJustCompletedAll,
    toggleHabit,
    addHabit,
    renameHabit,
    deleteHabit,
    resetAll,
    clearAll,
    exportData,
    importData,
  };
};
export default useHabits;
