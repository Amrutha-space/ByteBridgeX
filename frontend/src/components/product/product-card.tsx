"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { useCart } from "@/context/cart-context";
import { formatCurrency, slugLabel } from "@/lib/utils";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="glass-panel group overflow-hidden rounded-[30px]"
    >
      <div className="relative h-52 overflow-hidden border-b border-white/8 bg-linear-to-br from-white/8 via-secondary/10 to-primary/10">
        {product.preview_image ? (
          <Image
            src={product.preview_image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                Interactive Asset
              </p>
              <p className="mt-3 text-2xl font-semibold">{product.title}</p>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted">
              {slugLabel(product.category)}
            </p>
            <h3 className="text-xl font-semibold">{product.title}</h3>
            <p className="mt-2 text-sm text-muted">{product.short_description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted">Starting at</p>
            <p className="text-xl font-semibold text-accent">
              {formatCurrency(product.price)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.tech_stack.slice(0, 3).map((item) => (
            <span
              key={`${product.slug}-${item}`}
              className="rounded-full bg-white/6 px-3 py-1 text-xs text-muted"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/marketplace/${product.slug}`}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-primary/60 hover:bg-primary/10"
          >
            View Details
          </Link>
          <button
            onClick={() => addItem(product)}
            type="button"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:scale-[1.03]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
}
