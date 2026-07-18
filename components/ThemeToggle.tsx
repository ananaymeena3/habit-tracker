"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import useTheme from "@/hooks/useTheme";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-xl border border-border bg-card/20 animate-pulse" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 flex items-center justify-center rounded-xl border border-border glass-panel hover:bg-muted/30 transition-all duration-200 active:scale-95 cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-[18px] h-[18px] text-foreground" />
      ) : (
        <Sun className="w-[18px] h-[18px] text-foreground" />
      )}
    </button>
  );
};

export default ThemeToggle;
