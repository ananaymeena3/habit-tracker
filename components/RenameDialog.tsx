"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RenameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => { success: boolean; error?: string };
  currentName: string;
}

export const RenameDialog: React.FC<RenameDialogProps> = ({
  isOpen,
  onClose,
  onRename,
  currentName,
}) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Set initial value and focus input
  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setError("");
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen, currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim() === currentName) {
      onClose();
      return;
    }

    const result = onRename(name);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Failed to rename habit.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/40 dark:bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="w-full max-w-sm glass-panel rounded-2xl shadow-2xl relative overflow-hidden z-10 border border-border select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <Edit2 className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="font-semibold text-[15px] text-foreground">Rename Habit</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">New Name</label>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Enter habit name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-muted/20 focus:bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-hidden focus:ring-1.5 focus:ring-primary/40 focus:border-primary/50 transition-all duration-200"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-xs font-medium text-warning bg-warning/5 border border-warning/10 p-2.5 rounded-lg">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 h-9 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 h-9 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RenameDialog;
