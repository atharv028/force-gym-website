"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FORCE_ONE_FITNESS } from "@/lib/business";
import { Lock, User, Loader2, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = (await res.json()) as { error?: string };
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Login failed. Check your credentials.");
    router.push("/admin/dashboard");
  }

  return (
    <main className="relative flex min-h-dvh-safe items-center overflow-hidden bg-slate-950 px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(249,115,22,0.15),transparent_40%),radial-gradient(circle_at_85%_90%,rgba(249,115,22,0.08),transparent_35%)]" />

      <div className="relative mx-auto w-full max-w-sm">
        {/* Brand */}
        <div className="mb-7 flex justify-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_4px_20px_rgba(249,115,22,0.45)]">
              <span className="font-barlow-condensed text-base font-bold tracking-wider text-white">F1</span>
            </div>
            <div>
              <p className="font-barlow-condensed text-lg font-bold uppercase leading-none tracking-wider text-white">
                Force One Fitness
              </p>
              <p className="mt-0.5 text-xs uppercase tracking-widest text-slate-500">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-7 shadow-[0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10">
            <Lock className="h-5 w-5 text-orange-400" />
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.28em] text-orange-300">
            Restricted Access
          </p>
          <h1 className="mt-2 font-barlow-condensed text-3xl font-bold uppercase leading-tight text-white">
            Admin Sign In
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage attendance, members, and reports for {FORCE_ONE_FITNESS.name}.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                Username
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  className="w-full rounded-xl border border-slate-700/60 bg-slate-950/80 py-3 pl-10 pr-4 text-base text-white outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  className="w-full rounded-xl border border-slate-700/60 bg-slate-950/80 py-3 pl-10 pr-4 text-base text-white outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  placeholder="Enter password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error ? (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-3.5 font-semibold text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)] transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
