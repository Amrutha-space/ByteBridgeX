"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { ProductPreview3D } from "@/components/three/product-preview";
import { Loader } from "@/components/ui/loader";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const response = await api.get(`/marketplace/products/${params.slug}/`);
        setProduct(response.data);
      } catch {
        setError("Product details are unavailable right now.");
      } finally {
        setLoading(false);
      }
    }

    if (params.slug) {
      void loadProduct();
    }
  }, [params.slug]);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!product) {
      return;
    }

    await api.post(`/marketplace/products/${product.slug}/reviews/`, reviewForm);
    const response = await api.get(`/marketplace/products/${product.slug}/`);
    setProduct(response.data);
    setReviewForm({ rating: 5, comment: "" });
  }

  if (loading) {
    return <Loader label="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <div className="glass-panel rounded-[30px] p-8 text-danger">
        {error || "Product not found."}
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-8">
        <div className="glass-panel rounded-[36px] p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            {product.category}
          </p>
          <h1 className="mt-4 text-4xl font-semibold">{product.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
            {product.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] bg-white/5 p-5">
              <p className="text-sm text-muted">Price</p>
              <p className="mt-2 text-2xl font-semibold text-accent">
                {formatCurrency(product.price)}
              </p>
            </div>
            <div className="rounded-[24px] bg-white/5 p-5">
              <p className="text-sm text-muted">Rating</p>
              <p className="mt-2 text-2xl font-semibold">
                {product.average_rating} / 5
              </p>
            </div>
            <div className="rounded-[24px] bg-white/5 p-5">
              <p className="text-sm text-muted">Seller</p>
              <p className="mt-2 text-xl font-semibold">{product.seller.username}</p>
            </div>
          </div>
        </div>

        <ProductPreview3D title={product.title} />

        <section className="glass-panel rounded-[32px] p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            <p className="text-sm text-muted">{product.review_count} total</p>
          </div>
          <div className="mt-6 space-y-4">
            {product.reviews?.length ? (
              product.reviews.map((review) => (
                <div key={review.id} className="rounded-[24px] border border-white/8 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{review.user.username}</p>
                      <p className="text-sm text-muted">{formatDate(review.created_at)}</p>
                    </div>
                    <p className="text-warning">{review.rating} / 5</p>
                  </div>
                  <p className="mt-3 text-muted">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-muted">No reviews yet.</p>
            )}
          </div>

          {user ? (
            <form onSubmit={submitReview} className="mt-8 space-y-4 rounded-[24px] border border-white/8 p-5">
              <h3 className="text-lg font-semibold">Leave a review</h3>
              <select
                value={reviewForm.rating}
                onChange={(event) =>
                  setReviewForm((current) => ({
                    ...current,
                    rating: Number(event.target.value),
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating} className="bg-slate-950">
                    {rating}
                  </option>
                ))}
              </select>
              <textarea
                value={reviewForm.comment}
                onChange={(event) =>
                  setReviewForm((current) => ({
                    ...current,
                    comment: event.target.value,
                  }))
                }
                required
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                placeholder="What stood out in this asset?"
              />
              <button
                type="submit"
                className="rounded-full bg-white px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                Submit review
              </button>
            </form>
          ) : null}
        </section>
      </div>

      <aside className="space-y-6">
        <div className="glass-panel rounded-[32px] p-7">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Buy Now
          </p>
          <p className="mt-4 text-4xl font-semibold">{formatCurrency(product.price)}</p>
          <p className="mt-3 text-muted">
            Full asset files, commercial usage, and future updates from the seller.
          </p>
          <button
            onClick={() => addItem(product)}
            type="button"
            className="mt-6 w-full rounded-full bg-white px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
          >
            Add to cart
          </button>
        </div>

        <div className="glass-panel rounded-[32px] p-7">
          <h3 className="text-xl font-semibold">Tech stack</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.tech_stack.map((stack) => (
              <span key={stack} className="rounded-full bg-white/6 px-3 py-1 text-sm text-muted">
                {stack}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
