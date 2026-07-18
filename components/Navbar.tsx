"use client";

import React from "react";
import { LayoutGrid, Calendar, BarChart3, Settings, Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddHabitClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onAddHabitClick,
}) => {
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "heatmap", label: "Heatmap", icon: Calendar },
    { id: "statistics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop/Tablet Header */}
      <header className="sticky top-0 z-40 w-full glass-navbar border-b border-border select-none">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-base tracking-tight font-sans bg-clip-text text-foreground">
              HabitFlow
            </span>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/40">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-4 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="desktop-active-tab-indicator"
                      className="absolute inset-0 bg-card border border-border shadow-xs rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action buttons (Desktop) */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={onAddHabitClick}
              className="hidden md:flex items-center gap-1.5 px-4 h-9 rounded-xl bg-primary text-primary-foreground font-medium text-xs shadow-xs hover:opacity-90 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Habit
              <kbd className="ml-1 bg-primary-foreground/20 px-1 py-0.5 rounded-md text-[9px] font-mono">H</kbd>
            </button>
            <button
              onClick={onAddHabitClick}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground shadow-xs hover:opacity-90 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm glass-panel py-2 px-3 rounded-2xl shadow-xl flex justify-around items-center select-none border border-border">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative py-2 px-3.5 rounded-xl flex flex-col items-center gap-1 cursor-pointer transition-colors duration-200 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobile-active-tab-indicator"
                  className="absolute bottom-0 w-5 h-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
