"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

import useHabits from "@/hooks/useHabits";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import HeatmapView from "@/components/HeatmapView";
import StatisticsView from "@/components/StatisticsView";
import SettingsView from "@/components/SettingsView";
import AddHabitModal from "@/components/AddHabitModal";
import DeleteDialog from "@/components/DeleteDialog";
import RenameDialog from "@/components/RenameDialog";

export default function Home() {
  const {
    habits,
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
  } = useHabits();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Modal open states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingHabitId, setDeletingHabitId] = useState<string | null>(null);
  const [renamingHabit, setRenamingHabit] = useState<{ id: string; name: string } | null>(null);

  // Trigger celebration confetti when all habits are completed
  useEffect(() => {
    if (justCompletedAll) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.65 },
        colors: ["#2997ff", "#30d158", "#ff9f0a", "#bf5af2", "#ff375f"],
        disableForReducedMotion: true,
      });
      setJustCompletedAll(false);
    }
  }, [justCompletedAll, setJustCompletedAll]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input field
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      
      switch (key) {
        case "H":
          e.preventDefault();
          setIsAddModalOpen(true);
          break;
        case "D":
          e.preventDefault();
          setActiveTab("dashboard");
          break;
        case "M":
          e.preventDefault();
          setActiveTab("heatmap");
          break;
        case "A":
          e.preventDefault();
          setActiveTab("statistics");
          break;
        case "S":
          e.preventDefault();
          setActiveTab("settings");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Get name of the habit being deleted
  const deletingHabitName = habits.find((h) => h.id === deletingHabitId)?.name || "";

  // Render the current active view content
  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            habits={habits}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            analytics={analytics}
            onToggle={toggleHabit}
            onRename={(id, name) => setRenamingHabit({ id, name })}
            onDelete={(id) => setDeletingHabitId(id)}
            onAddClick={() => setIsAddModalOpen(true)}
            setActiveTab={setActiveTab}
          />
        );
      case "heatmap":
        return <HeatmapView habits={habits} />;
      case "statistics":
        return <StatisticsView habits={habits} analytics={analytics} />;
      case "settings":
        return (
          <SettingsView
            onResetAll={resetAll}
            onClearAll={clearAll}
            onExport={exportData}
            onImport={importData}
          />
        );
      default:
        return null;
    }
  };

  // Render skeleton loaders before localStorage is read on mount to avoid layout shifts
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center animate-spin">
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground animate-pulse">
            Loading Habits...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-28 md:pb-0">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAddHabitClick={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-6 md:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals & Dialogs */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addHabit}
      />

      <RenameDialog
        isOpen={renamingHabit !== null}
        onClose={() => setRenamingHabit(null)}
        currentName={renamingHabit?.name || ""}
        onRename={(newName) => {
          if (!renamingHabit) return { success: false, error: "No habit selected" };
          return renameHabit(renamingHabit.id, newName);
        }}
      />

      <DeleteDialog
        isOpen={deletingHabitId !== null}
        onClose={() => setDeletingHabitId(null)}
        habitName={deletingHabitName}
        onConfirm={() => {
          if (deletingHabitId) {
            deleteHabit(deletingHabitId);
          }
        }}
      />
    </div>
  );
}
