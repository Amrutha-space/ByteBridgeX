"use client";

import { useState } from "react";

import { Loader } from "@/components/ui/loader";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    if (!user) {
      setError("Please log in before starting checkout.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await Promise.all(
        items.map((item) =>
          api.post("/orders/cart/", {
            product_id: item.product.id,
            quantity: item.quantity,
          }),
        ),
      );

      const response = await api.post("/payments/checkout-session/");
      const { url } = response.data as {
        session_id: string;
        url: string;
      };

      window.location.href = url;
    } catch {
      setError("Checkout could not be started. Verify the backend and Stripe keys.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loader label="Preparing secure checkout..." />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <section className="glass-panel rounded-[32px] p-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          Checkout
        </p>
        <h1 className="mt-4 text-4xl font-semibold">Complete your purchase</h1>
        <p className="mt-3 text-muted">
          Your order will create secure access to purchased files after payment confirmation.
        </p>

        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div key={item.product.slug} className="rounded-[24px] border border-white/8 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{item.product.title}</p>
                  <p className="text-sm text-muted">
                    {item.quantity} x {formatCurrency(item.product.price)}
                  </p>
                </div>
                <p className="font-semibold">
                  {formatCurrency(Number(item.product.price) * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="glass-panel h-fit rounded-[32px] p-7">
        <h2 className="text-2xl font-semibold">Payment Summary</h2>
        <div className="mt-5 flex items-center justify-between text-muted">
          <span>Items</span>
          <span>{items.length}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-muted">
          <span>Total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {error ? <p className="mt-5 text-sm text-danger">{error}</p> : null}
        <button
          onClick={handleCheckout}
          type="button"
          className="mt-6 w-full rounded-full bg-white px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
        >
          Pay with Stripe
        </button>
      </aside>
    </div>
  );
}
