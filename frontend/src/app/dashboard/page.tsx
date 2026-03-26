"use client";

import { FormEvent, useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type UploadFormState = {
  title: string;
  slug: string;
  description: string;
  short_description: string;
  category: string;
  price: string;
  tech_stack: string;
  tags: string;
  preview_model_url: string;
  downloadable_file: File | null;
  preview_image: File | null;
};

const initialForm: UploadFormState = {
  title: "",
  slug: "",
  description: "",
  short_description: "",
  category: "react",
  price: "49.00",
  tech_stack: "Next.js,Tailwind",
  tags: "marketplace,components",
  preview_model_url: "",
  downloadable_file: null,
  preview_image: null,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [earnings, setEarnings] = useState<{ total_earnings: string; sales: unknown[] }>({
    total_earnings: "0.00",
    sales: [],
  });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<UploadFormState>(initialForm);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) {
        return;
      }
      try {
        const [productsResponse, earningsResponse] = await Promise.all([
          api.get("/marketplace/products/mine/"),
          api.get("/orders/earnings/"),
        ]);
        setProducts(productsResponse.data);
        setEarnings(earningsResponse.data);
      } catch {
        setError("Seller data could not be loaded. Log in with a seller account.");
      }
    }

    void loadDashboard();
  }, [user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData();
    data.append("title", form.title);
    data.append("slug", form.slug);
    data.append("description", form.description);
    data.append("short_description", form.short_description);
    data.append("category", form.category);
    data.append("price", form.price);
    data.append("tech_stack", JSON.stringify(form.tech_stack.split(",").map((item) => item.trim())));
    data.append("tags", JSON.stringify(form.tags.split(",").map((item) => item.trim())));
    data.append("preview_model_url", form.preview_model_url);
    if (form.downloadable_file) {
      data.append("downloadable_file", form.downloadable_file);
    }
    if (form.preview_image) {
      data.append("preview_image", form.preview_image);
    }

    try {
      await api.post("/marketplace/products/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setOpen(false);
      setForm(initialForm);
      const response = await api.get("/marketplace/products/mine/");
      setProducts(response.data);
    } catch {
      setError("Product upload failed. Make sure you are logged in as a seller.");
    }
  }

  if (!user) {
    return (
      <div className="glass-panel rounded-[32px] p-8 text-muted">
        Please log in to view your seller dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="glass-panel rounded-[36px] p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Seller Dashboard
          </p>
          <h1 className="mt-4 text-4xl font-semibold">Build your storefront inventory.</h1>
          <p className="mt-3 text-muted">
            Upload products, track earnings, and manage your commercial catalog.
          </p>
          <button
            onClick={() => setOpen(true)}
            type="button"
            className="mt-6 rounded-full bg-white px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
          >
            Upload Product
          </button>
          {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
        </div>
        <div className="glass-panel rounded-[36px] p-8">
          <p className="text-sm text-muted">Total earnings</p>
          <p className="mt-3 text-5xl font-semibold text-accent">
            {formatCurrency(earnings.total_earnings)}
          </p>
          <p className="mt-3 text-sm text-muted">
            Synced from paid orders in your marketplace account.
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="glass-panel rounded-[32px] p-8">
          <h2 className="text-2xl font-semibold">Uploaded products</h2>
          <div className="mt-6 space-y-4">
            {products.length ? (
              products.map((product) => (
                <div key={product.slug} className="rounded-[24px] border border-white/8 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{product.title}</p>
                      <p className="mt-1 text-sm text-muted">{product.short_description}</p>
                    </div>
                    <p className="font-semibold text-accent">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No uploads yet.</p>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-[32px] p-8">
          <h2 className="text-2xl font-semibold">Recent sales</h2>
          <div className="mt-6 space-y-4">
            {Array.isArray(earnings.sales) && earnings.sales.length ? (
              earnings.sales.map((sale, index) => (
                <div key={index} className="rounded-[24px] border border-white/8 p-5 text-sm text-muted">
                  <pre className="whitespace-pre-wrap break-words font-mono text-xs">
                    {JSON.stringify(sale, null, 2)}
                  </pre>
                </div>
              ))
            ) : (
              <p className="text-muted">No completed sales yet.</p>
            )}
          </div>
        </div>
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Upload a new product">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Title"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          />
          <input
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
            placeholder="Slug"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          />
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            placeholder="Description"
            rows={4}
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          />
          <input
            value={form.short_description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                short_description: event.target.value,
              }))
            }
            placeholder="Short description"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <option value="react" className="bg-slate-950">React</option>
              <option value="ai" className="bg-slate-950">AI</option>
              <option value="backend" className="bg-slate-950">Backend</option>
              <option value="ui-kits" className="bg-slate-950">UI Kits</option>
              <option value="templates" className="bg-slate-950">Templates</option>
            </select>
            <input
              value={form.price}
              onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
              placeholder="Price"
              type="number"
              step="0.01"
              min="0"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            />
          </div>
          <input
            value={form.tech_stack}
            onChange={(event) =>
              setForm((current) => ({ ...current, tech_stack: event.target.value }))
            }
            placeholder="Tech stack comma-separated"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          />
          <input
            value={form.tags}
            onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
            placeholder="Tags comma-separated"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          />
          <input
            value={form.preview_model_url}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                preview_model_url: event.target.value,
              }))
            }
            placeholder="3D model URL (optional)"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="file"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  downloadable_file: event.target.files?.[0] ?? null,
                }))
              }
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  preview_image: event.target.files?.[0] ?? null,
                }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-white px-5 py-3 font-semibold text-slate-950"
          >
            Publish Product
          </button>
        </form>
      </Modal>
    </div>
  );
}
