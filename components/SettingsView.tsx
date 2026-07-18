"use client";

import React, { useRef, useState } from "react";
import { Download, Upload, RotateCcw, Trash2, Keyboard, ShieldCheck, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface SettingsViewProps {
  onResetAll: () => void;
  onClearAll: () => void;
  onExport: () => void;
  onImport: (jsonData: string) => { success: boolean; error?: string };
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onResetAll,
  onClearAll,
  onExport,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target?.result as string;
      const result = onImport(contents);
      
      if (result.success) {
        setImportStatus({
          type: "success",
          message: "Data imported successfully!",
        });
      } else {
        setImportStatus({
          type: "error",
          message: result.error || "Failed to import data.",
        });
      }
      
      // Clear status after 4 seconds
      setTimeout(() => {
        setImportStatus({ type: null, message: "" });
      }, 4000);
    };
    reader.readAsText(file);
    // Reset file input value so same file can be selected again
    e.target.value = "";
  };

  const keyboardShortcuts = [
    { key: "H", desc: "Open Add Habit Modal" },
    { key: "/", desc: "Focus Search Box" },
    { key: "D", desc: "Navigate to Dashboard" },
    { key: "M", desc: "Navigate to Heatmap View" },
    { key: "A", desc: "Navigate to Analytics View" },
    { key: "S", desc: "Navigate to Settings View" },
  ];

  return (
    <div className="flex flex-col gap-6 md:pb-8 select-none">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Application Control
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
          Settings
        </h2>
      </motion.div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Backups & Portability Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-panel p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-sm text-foreground">Data Backups</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Export your data as a JSON file or import a backup.
            </p>
            
            {/* Import Status Alert */}
            {importStatus.type && (
              <div
                className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-medium border ${
                  importStatus.type === "success"
                    ? "bg-success/5 border-success/15 text-success"
                    : "bg-warning/5 border-warning/15 text-warning"
                }`}
              >
                {importStatus.type === "success" ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{importStatus.message}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2.5 mt-6">
            <button
              onClick={onExport}
              className="flex-1 flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold active:scale-97 transition-all duration-150 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Backup
            </button>
            
            <button
              onClick={handleImportClick}
              className="flex-1 flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold active:scale-97 transition-all duration-150 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Import Backup
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </motion.div>

        {/* Keyboard Shortcuts Cheatsheet */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="glass-panel p-5 rounded-2xl border border-border shadow-xs flex flex-col"
        >
          <div className="flex items-center gap-1.5 mb-3">
            <Keyboard className="w-4.5 h-4.5 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Keyboard Shortcuts</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-2 mt-2">
            {keyboardShortcuts.map((item) => (
              <div key={item.key} className="flex items-center justify-between py-1.5 border-b border-border/40 text-xs">
                <span className="text-muted-foreground font-medium">{item.desc}</span>
                <kbd className="px-2 py-1 bg-muted rounded-md text-[10px] font-mono font-bold border border-border/80 shadow-xs">
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info & Hosting Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-panel p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4.5 h-4.5 text-success" />
              <h3 className="font-bold text-sm text-foreground">Offline Privacy</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              HabitFlow operates completely locally. Your tracking history is stored inside your browser's local storage and never leaves your device.
            </p>
            <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed font-semibold">
              ✔ No tracking pixels • No cloud sync • No accounts required.
            </p>
          </div>
          
          <div className="text-[10px] text-muted-foreground font-semibold border-t border-border/40 pt-4 mt-6">
            Version 1.0.0 • Designed for speed.
          </div>
        </motion.div>

        {/* Danger Zone Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="glass-panel p-5 rounded-2xl border border-warning/15 dark:border-warning/10 shadow-xs flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-sm text-warning">Danger Zone</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently overwrite or delete your habits.
            </p>
          </div>
          
          <div className="flex flex-col gap-2 mt-6">
            {/* Reset presets confirmation block */}
            {showResetConfirm ? (
              <div className="flex flex-col gap-2 p-3 bg-muted/40 rounded-xl border border-border text-xs">
                <span className="font-semibold text-foreground">Reset habits to presets?</span>
                <span className="text-muted-foreground text-[10px]">
                  This resets the list to the 16 original presets and generates fresh mock data.
                </span>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => {
                      onResetAll();
                      setShowResetConfirm(false);
                    }}
                    className="px-3 py-1.5 bg-warning hover:bg-warning/90 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-foreground font-semibold text-[10px] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center justify-between w-full h-10 px-4 rounded-xl bg-warning/5 hover:bg-warning/10 text-warning text-xs font-semibold transition-all duration-150 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Restore Default Seed Data
                </span>
                <span className="text-[10px] text-warning bg-warning/10 px-2 py-0.5 rounded-md">Preset</span>
              </button>
            )}

            {/* Clear all confirmation block */}
            {showClearConfirm ? (
              <div className="flex flex-col gap-2 p-3 bg-warning/5 rounded-xl border border-warning/10 text-xs">
                <span className="font-bold text-warning">Clear ALL habit history?</span>
                <span className="text-muted-foreground text-[10px]">
                  This is permanent and deletes all custom and default habits. There is no undo.
                </span>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => {
                      onClearAll();
                      setShowClearConfirm(false);
                    }}
                    className="px-3 py-1.5 bg-warning text-white rounded-lg font-bold text-[10px] cursor-pointer"
                  >
                    Confirm Delete All
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-foreground font-semibold text-[10px] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center justify-between w-full h-10 px-4 rounded-xl bg-warning hover:bg-warning/90 text-white text-xs font-semibold transition-all duration-150 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Wipe All Habits & Data
                </span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-md font-bold">Wipe</span>
              </button>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default SettingsView;
