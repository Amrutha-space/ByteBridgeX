"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await login(form.email, form.password);
      router.push("/dashboard");
    } catch {
      setError("Login failed. Confirm your credentials and backend availability.");
    }
  }

  return (
    <div className="glass-panel mx-auto w-full max-w-xl rounded-[36px] p-8">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Welcome back</p>
      <h1 className="mt-4 text-4xl font-semibold">Log in to ByteBridgeX</h1>
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
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
          type="password"
          required
          placeholder="Password"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button
          type="submit"
          className="w-full rounded-full bg-white px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
