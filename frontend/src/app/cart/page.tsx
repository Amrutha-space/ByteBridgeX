"use client";

import Link from "next/link";

import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-4">
        <div className="glass-panel rounded-[32px] p-8">
          <h1 className="text-4xl font-semibold">Your Cart</h1>
          <p className="mt-3 text-muted">Adjust quantities, review pricing, and move to checkout.</p>
        </div>

        {items.length ? (
          items.map((item) => (
            <div key={item.product.slug} className="glass-panel rounded-[28px] p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{item.product.title}</h2>
                  <p className="mt-2 text-muted">{item.product.short_description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(item.product.slug, Number(event.target.value))
                    }
                    type="number"
                    min={1}
                    className="w-24 rounded-2xl border border-white/10 bg-white/5 px-4 py-2"
                  />
                  <p className="text-lg font-semibold">
                    {formatCurrency(Number(item.product.price) * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.product.slug)}
                    type="button"
                    className="rounded-full border border-danger/30 px-4 py-2 text-sm text-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel rounded-[28px] p-8 text-center text-muted">
            Your cart is empty. Browse the{" "}
            <Link href="/marketplace" className="text-primary">
              marketplace
            </Link>
            .
          </div>
        )}
      </section>

      <aside className="glass-panel h-fit rounded-[32px] p-7">
        <h2 className="text-2xl font-semibold">Order Summary</h2>
        <div className="mt-5 flex items-center justify-between text-muted">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-muted">
          <span>Platform fee</span>
          <span>{formatCurrency(0)}</span>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-5 text-lg font-semibold">
          <span>Total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
        >
          Continue to Checkout
        </Link>
      </aside>
    </div>
  );
}
