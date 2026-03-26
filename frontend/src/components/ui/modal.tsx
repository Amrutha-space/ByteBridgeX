"use client";

import { AnimatePresence, motion } from "framer-motion";

type ModalProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export function Modal({ open, title, children, onClose }: ModalProps) {
  return (

    <AnimatePresence>
  {open ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 p-4"
    >
      <div className="flex min-h-full items-start justify-center py-10">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 16 }}
          className="glass-panel w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-[28px] p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-full border border-white/10 px-3 py-1 text-sm text-muted transition hover:text-white"
              type="button"
            >
              Close
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    </motion.div>
  ) : null}
</AnimatePresence>
  );
}