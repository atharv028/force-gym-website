"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FORCE_ONE_FITNESS } from "@/lib/business";
import { ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

function VerifyForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const phone = params.get("phone") ?? "";
  const next = params.get("next") ?? "/scan";
  const testOtp = params.get("testOtp") ?? "";
  const router = useRouter();

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code, next }),
    });
    const data = (await res.json()) as { error?: string; redirectTo?: string };
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Verification failed");
    router.push(data.redirectTo ?? "/scan");
  }

  const maskedPhone = phone
    ? phone.slice(0, -4).replace(/\d/g, "•") + phone.slice(-4)
    : "your number";

  return (
    <main className="relative flex min-h-dvh-safe items-center overflow-hidden bg-slate-950 px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(249,115,22,0.16),transparent_40%),radial-gradient(circle_at_80%_90%,rgba(34,197,94,0.14),transparent_38%)]" />

      <div className="relative mx-auto w-full max-w-sm">
        {/* Brand header */}
        <div className="mb-7 flex justify-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_4px_20px_rgba(249,115,22,0.45)]">
              <span className="font-barlow-condensed text-base font-bold tracking-wider text-white">F1</span>
            </div>
            <div>
              <p className="font-barlow-condensed text-lg font-bold uppercase leading-none tracking-wider text-white">
                Force One Fitness
              </p>
              <p className="mt-0.5 text-xs uppercase tracking-widest text-slate-500">Bhopal, MP</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-[0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {/* Icon */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.28em] text-emerald-300">Secure Access</p>
          <h1 className="mt-2 font-barlow-condensed text-3xl font-bold uppercase leading-tight text-white">
            Verify Your
            <br />
            Identity
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter the 6-digit code sent to{" "}
            <span className="font-medium text-slate-200">{maskedPhone}</span>
          </p>
          <p className="mt-0.5 text-xs text-slate-500">for {FORCE_ONE_FITNESS.name}</p>
          {testOtp ? (
            <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              Test OTP: <span className="font-barlow-condensed text-base font-semibold tracking-widest">{testOtp}</span>
            </div>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={handleVerify}>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                One-Time Code
              </label>
              <input
                className="w-full rounded-xl border border-slate-700/60 bg-slate-950/80 px-4 py-4 text-center font-barlow-condensed text-3xl font-bold tracking-[0.5em] text-white outline-none transition-all duration-200 placeholder:text-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="• • • • • •"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                aria-label="One-time passcode"
              />
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
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-3.5 font-semibold text-white shadow-[0_4px_16px_rgba(34,197,94,0.3)] transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading || code.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  Verify &amp; Check In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-slate-600">
          <Link href="/onboard" className="transition-colors hover:text-slate-400">
            ← Wrong number? Go back
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
