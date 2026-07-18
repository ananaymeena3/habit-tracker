"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, emoji: string) => { success: boolean; error?: string };
}

const COMMON_EMOJIS = [
  "🏋️", "📚", "🧘", "💧", "💻", "🧠", "😴", "🥗", 
  "🚶", "✍️", "🎵", "📖", "🧹", "🧎", "🪥", "☀️",
  "🎨", "🍎", "🛹", "🚀", "🤝", "💼", "💰", "🔋"
];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("✨");
  const [customEmoji, setCustomEmoji] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setName("");
      setSelectedEmoji("✨");
      setCustomEmoji("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emojiToUse = customEmoji.trim() ? customEmoji.trim() : selectedEmoji;
    const result = onAdd(name, emojiToUse);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Failed to create habit.");
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setCustomEmoji("");
  };

  const handleCustomEmojiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Limit to 1 character (or a single emoji)
    setCustomEmoji(val);
    if (val.trim()) {
      setSelectedEmoji("");
    } else {
      setSelectedEmoji("✨");
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

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="w-full max-w-md glass-panel rounded-2xl shadow-2xl relative overflow-hidden z-10 border border-border select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="font-semibold text-[15px] text-foreground">Add New Habit</h3>
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
              {/* Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Habit Name</label>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="e.g. Meditate, Study, Drink Water..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-muted/20 focus:bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-hidden focus:ring-1.5 focus:ring-primary/40 focus:border-primary/50 transition-all duration-200"
                />
              </div>

              {/* Emoji Picker */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground">Select Emoji</label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground font-medium">Or custom:</span>
                    <input
                      type="text"
                      placeholder="✨"
                      maxLength={4}
                      value={customEmoji}
                      onChange={handleCustomEmojiChange}
                      className="w-8 h-6 text-center text-xs border border-border rounded-md bg-muted/20 focus:outline-hidden focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-8 gap-2 bg-muted/20 p-2.5 rounded-xl border border-border/40 max-h-[140px] overflow-y-auto">
                  {COMMON_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleEmojiSelect(emoji)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-base hover:bg-muted/80 active:scale-90 transition-all duration-150 cursor-pointer ${
                        selectedEmoji === emoji ? "bg-primary/10! ring-1.5 ring-primary/40!" : ""
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-xs font-medium text-warning bg-warning/5 border border-warning/10 p-2.5 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Buttons */}
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
                  Create Habit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddHabitModal;
