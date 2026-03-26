"use client";

import { AnimatePresence, motion } from "framer-motion";

import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </CartProvider>
    </AuthProvider>
  );
}
