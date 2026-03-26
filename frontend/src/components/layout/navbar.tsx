"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/cart", label: "Cart" },
];

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, loading: cartLoading } = useCart();
  const { user, logout, loading: authLoading } = useAuth();

  const isReady = !authLoading && !cartLoading;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed inset-x-0 top-0 z-40 border-b border-white/8 bg-[#06101cb3] backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary text-sm font-bold text-slate-950">
            BX
          </div>
          <div>
            <p className="text-lg font-semibold">ByteBridgeX</p>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
              Where Code Meets Commerce
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-muted hover:bg-white/6 hover:text-white"
                }`}
              >
                {link.label}
                {link.href === "/cart" ? ` (${isReady ? itemCount : 0})` : ""}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {!isReady ? (
            <div className="flex items-center gap-2">
              <div className="h-10 w-24 rounded-full border border-white/10" />
              <div className="h-10 w-28 rounded-full border border-white/10" />
            </div>
          ) : user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-muted">
                  {user.role}
                </p>
              </div>
              <button
                onClick={logout}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-muted transition hover:border-white/20 hover:text-white"
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-muted transition hover:border-white/20 hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                Start Selling
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
