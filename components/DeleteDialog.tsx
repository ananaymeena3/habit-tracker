"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  habitName: string;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  habitName,
}) => {
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
            transition={{ type: "spring", duration: 0.3 }}
            className="w-full max-w-sm glass-panel rounded-2xl shadow-2xl relative overflow-hidden z-10 border border-border select-none"
          >
            <div className="p-5 flex flex-col items-center text-center">
              {/* Warning Badge */}
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>

              {/* Title */}
              <h3 className="font-semibold text-[15px] text-foreground">Delete Habit?</h3>
              <p className="text-xs text-muted-foreground mt-2 px-3">
                Are you sure you want to delete <span className="font-bold text-foreground">"{habitName}"</span>?
                This will permanently delete all its completion history and streak data.
              </p>

              {/* Buttons */}
              <div className="flex items-center justify-center gap-2 mt-5 w-full">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 h-9 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="flex-1 px-4 h-9 rounded-xl bg-warning hover:bg-warning/90 text-white font-semibold text-xs active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteDialog;
