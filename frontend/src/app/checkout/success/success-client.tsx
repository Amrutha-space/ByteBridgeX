"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Loader } from "@/components/ui/loader";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { api } from "@/lib/api";

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    async function confirmOrder() {
      const sessionId = searchParams.get("session_id");
      const localOrder = searchParams.get("local_order");

      try {
        if (sessionId && user) {
          await api.post("/payments/confirm/", { session_id: sessionId });
        }
        if (localOrder || sessionId) {
          clearCart();
        }
        setStatus("done");
      } catch {
        setStatus("error");
      }
    }

    void confirmOrder();
  }, [searchParams, user, clearCart]);

  if (status === "loading") {
    return <Loader label="Confirming payment..." />;
  }

  if (status === "error") {
    return (
      <div className="glass-panel rounded-[32px] p-8 text-danger">
        We could not verify your payment automatically. Please check your orders or retry.
      </div>
    );
  }

  return (
    <div className="glass-panel mx-auto max-w-2xl rounded-[36px] p-10 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
        Payment Success
      </p>
      <h1 className="mt-4 text-4xl font-semibold">Your purchase is confirmed.</h1>
      <p className="mt-4 text-muted">
        Download access is now unlocked through your account and orders.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/dashboard"
          className="rounded-full bg-white px-5 py-3 font-semibold text-slate-950"
        >
          Open dashboard
        </Link>
        <Link
          href="/marketplace"
          className="rounded-full border border-white/10 px-5 py-3 font-semibold"
        >
          Continue browsing
        </Link>
      </div>
    </div>
  );
}
