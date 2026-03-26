"use client";

import { useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/product/product-card";
import { Loader } from "@/components/ui/loader";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";

const categories = ["", "react", "ai", "backend", "ui-kits", "templates"];

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [techStack, setTechStack] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await api.get("/marketplace/products/", {
          params: {
            search: search || undefined,
            category: category || undefined,
            tech_stack: techStack || undefined,
            max_price: maxPrice || undefined,
          },
        });
        setProducts(response.data.results ?? response.data);
        setError("");
      } catch {
        setError("We couldn't load the marketplace. Confirm the Django API is running.");
      } finally {
        setLoading(false);
      }
    }

    void loadProducts();
  }, [search, category, techStack, maxPrice]);

  const emptyState = useMemo(
    () =>
      !loading &&
      !error && (
        <div className="glass-panel rounded-[30px] p-8 text-center text-muted">
          No products matched this filter set yet.
        </div>
      ),
    [loading, error],
  );

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-[36px] p-8">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-primary">
          Marketplace
        </p>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold">Discover code products worth shipping.</h1>
            <p className="mt-3 max-w-2xl text-muted">
              Explore APIs, component systems, templates, and AI product building
              blocks with clear pricing and seller trust signals.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-primary/60"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-primary/60"
          >
            {categories.map((item) => (
              <option key={item || "all"} value={item} className="bg-slate-950">
                {item ? item : "All categories"}
              </option>
            ))}
          </select>
          <input
            value={techStack}
            onChange={(event) => setTechStack(event.target.value)}
            placeholder="Tech stack"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-primary/60"
          />
          <input
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="Max price"
            type="number"
            min="0"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-primary/60"
          />
        </div>
      </section>

      {loading ? <Loader label="Loading marketplace products..." /> : null}
      {error ? (
        <div className="glass-panel rounded-[28px] border border-danger/40 p-6 text-danger">
          {error}
        </div>
      ) : null}
      {!loading && !error && products.length > 0 ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </section>
      ) : null}
      {!products.length ? emptyState : null}
    </div>
  );
}
