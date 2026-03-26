"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/auth-context";
import type { UserRole } from "@/lib/types";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    role: "seller" as UserRole,
  });
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await signup(form);
      router.push("/dashboard");
    } catch {
      setError("Account creation failed. Confirm the API is running and try again.");
    }
  }

  return (
    <div className="glass-panel mx-auto w-full max-w-xl rounded-[36px] p-8">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Get Started</p>
      <h1 className="mt-4 text-4xl font-semibold">Create your seller or buyer account</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        />
        <input
          value={form.username}
          onChange={(event) =>
            setForm((current) => ({ ...current, username: event.target.value }))
          }
          required
          placeholder="Username"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        />
        <input
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
          type="password"
          required
          minLength={8}
          placeholder="Password"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        />
        <select
          value={form.role}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              role: event.target.value as UserRole,
            }))
          }
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        >
          <option value="seller" className="bg-slate-950">
            Seller
          </option>
          <option value="buyer" className="bg-slate-950">
            Buyer
          </option>
        </select>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button
          type="submit"
          className="w-full rounded-full bg-white px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
        >
          Create account
        </button>
      </form>
    </div>
  );
}
