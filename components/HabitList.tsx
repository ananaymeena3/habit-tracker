"use client";

import React, { useRef, useEffect } from "react";
import { Search, SlidersHorizontal, Plus, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Habit, SortOption } from "@/types";
import HabitCard from "./HabitCard";

interface HabitListProps {
  habits: Habit[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  onToggle: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  onToggle,
  onRename,
  onDelete,
  onAddClick,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Press "/" to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col gap-5 select-none">
      {/* Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search habits... (Press / to search)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border glass-panel text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-hidden focus:ring-1.5 focus:ring-primary/40 focus:border-primary/50 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="relative shrink-0 flex items-center gap-2">
          <SlidersHorizontal className="absolute left-3.5 w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-10 pl-9 pr-8 rounded-xl border border-border glass-panel text-xs font-medium text-foreground bg-transparent focus:outline-hidden focus:ring-1.5 focus:ring-primary/40 focus:border-primary/50 transition-all duration-200 cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2386868b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 8px center",
              backgroundSize: "16px 16px",
              backgroundRepeat: "no-repeat",
            }}
          >
            <option value="newest" className="bg-card">Newest First</option>
            <option value="alphabetical" className="bg-card">Alphabetical</option>
            <option value="streak" className="bg-card">Highest Streak</option>
            <option value="completed" className="bg-card">Most Completed</option>
          </select>
        </div>
      </div>

      {/* Habit Cards List Container */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {habits.length > 0 ? (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={onToggle}
                onRename={onRename}
                onDelete={onDelete}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="glass-panel rounded-2xl py-12 px-6 flex flex-col items-center justify-center text-center border border-dashed border-border"
            >
              {searchQuery ? (
                <>
                  <p className="font-semibold text-foreground text-sm">No results found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try searching for something else or clear the query.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-xs font-semibold transition-colors duration-200 cursor-pointer"
                  >
                    Reset Search
                  </button>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground text-sm">No habits active</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start tracking your life by creating your first habit!
                  </p>
                  <button
                    onClick={onAddClick}
                    className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl text-xs font-semibold shadow-xs transition-opacity duration-200 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Habit
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HabitList;
