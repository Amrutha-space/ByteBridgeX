import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="glass-panel mx-auto max-w-2xl rounded-[36px] p-10 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-warning">
        Checkout Cancelled
      </p>
      <h1 className="mt-4 text-4xl font-semibold">Your payment was not completed.</h1>
      <p className="mt-4 text-muted">
        Your cart is still intact, so you can review items and retry when you are ready.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/checkout"
          className="rounded-full bg-white px-5 py-3 font-semibold text-slate-950"
        >
          Retry checkout
        </Link>
        <Link
          href="/cart"
          className="rounded-full border border-white/10 px-5 py-3 font-semibold"
        >
          Back to cart
        </Link>
      </div>
    </div>
  );
}
