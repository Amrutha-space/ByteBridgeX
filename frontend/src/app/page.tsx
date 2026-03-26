"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductPreview3D } from "@/components/three/product-preview";
import type { Product } from "@/lib/types";

const featuredProducts: Product[] = [
  {
    id: 1,
    seller: {
      id: 1,
      email: "maya@bytebridgex.dev",
      username: "mayadev",
      role: "seller",
    },
    title: "Pulse UI Commerce Kit",
    slug: "pulse-ui-commerce-kit",
    description: "A premium commerce-ready component library for high-conversion storefronts.",
    short_description: "Animated storefront components, dashboards, and conversion widgets.",
    category: "ui-kits",
    tech_stack: ["Next.js", "Tailwind", "Framer Motion"],
    tags: ["commerce", "dashboard", "motion"],
    price: "79.00",
    average_rating: "4.90",
    review_count: 26,
    preview_model_url: "",
    preview_image: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    seller: {
      id: 2,
      email: "omar@bytebridgex.dev",
      username: "omarai",
      role: "seller",
    },
    title: "Vector AI API Starter",
    slug: "vector-ai-api-starter",
    description: "A deployable AI API starter with auth, metering, and model routing.",
    short_description: "Ready-to-sell backend starter for AI products and internal tools.",
    category: "ai",
    tech_stack: ["Django", "PostgreSQL", "Stripe"],
    tags: ["ai", "api", "payments"],
    price: "129.00",
    average_rating: "4.80",
    review_count: 18,
    preview_model_url: "",
    preview_image: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const featureStats = [
  { label: "Monthly creators", value: "4.2K" },
  { label: "Gross marketplace volume", value: "$182K" },
  { label: "Avg. product rating", value: "4.9/5" },
];

export default function HomePage() {
  return (
    <div className="space-y-16 pb-10">
      <section className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.28em] text-primary"
          >
            ByteBridgeX
            <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-white">
              Launch-ready marketplace
            </span>
          </motion.div>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight sm:text-6xl">
              Sell developer assets with a storefront that feels{" "}
              <span className="text-gradient">venture-backed from day one.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted">
              Buy and sell code components, UI kits, APIs, templates, and AI models
              with immersive previews, secure checkout, and a seller workflow that
              scales.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/marketplace"
              className="rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.03]"
            >
              Explore Marketplace
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:border-primary/50 hover:bg-primary/10"
            >
              Open Seller Dashboard
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {featureStats.map((stat) => (
              <div key={stat.label} className="glass-panel rounded-[24px] p-5">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <ProductPreview3D title="Marketplace-ready interactive card" />
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Featured Drops"
          title="High-signal assets shipping faster than in-house roadmaps."
          description="Premium templates, APIs, and AI-ready building blocks from sellers who know how teams actually ship."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Searchable marketplace",
            description: "Filter by category, price, and tech stack with a clean buyer flow.",
          },
          {
            title: "Secure checkout",
            description: "JWT auth and Stripe-backed purchasing with post-payment order creation.",
          },
          {
            title: "Seller workflow",
            description: "Upload assets, manage listings, track earnings, and moderate content through Django admin.",
          },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            className="glass-panel rounded-[30px] p-6"
          >
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">
              0{index + 1}
            </p>
            <h3 className="mt-4 text-2xl font-semibold">{feature.title}</h3>
            <p className="mt-3 text-muted">{feature.description}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
