"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FORCE_ONE_FITNESS } from "@/lib/business";
import { ArrowRight, Loader2, MapPin } from "lucide-react";

type LoadingPhase = "idle" | "locating" | "sending";

function OnboardForm() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [phase, setPhase] = useState<LoadingPhase>("idle");
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/scan";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!accepted) return setError("Please accept the privacy notice first.");

    setPhase("locating");

    if (!navigator.geolocation) {
      setPhase("idle");
      return setError("Geolocation is not supported on this device.");
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setPhase("sending");
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        });
        const data = (await res.json()) as { error?: string; testOtp?: string };
        setPhase("idle");
        if (!res.ok) return setError(data.error ?? "Failed to send OTP");
        const testOtpParam = data.testOtp ? `&testOtp=${encodeURIComponent(data.testOtp)}` : "";
        router.push(
          `/verify?phone=${encodeURIComponent(phone)}&next=${encodeURIComponent(next)}${testOtpParam}`,
        );
      },
      () => {
        setPhase("idle");
        setError("Location access denied. Please enable GPS and try again. / कृपया लोकेशन ऑन करें।");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }

  const loading = phase !== "idle";

  return (
    <main className="relative flex min-h-dvh-safe items-center overflow-hidden bg-slate-950 px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(249,115,22,0.2),transparent_42%),radial-gradient(circle_at_85%_100%,rgba(34,197,94,0.12),transparent_38%)]" />

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
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-orange-300">
            Member Check-in
          </p>
          <h1 className="mt-2 font-barlow-condensed text-3xl font-bold uppercase leading-tight text-white">
            Enter Your
            <br />
            Phone Number
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            We&apos;ll send a secure one-time code via SMS to verify your identity.
          </p>

          {/* Gym info pills */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
              <span className="text-orange-300">★</span> {FORCE_ONE_FITNESS.rating}.0 Rating
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
              Open 5–11 AM
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                Phone Number
              </label>
              <input
                className="w-full rounded-xl border border-slate-700/60 bg-slate-950/80 px-4 py-3 text-base text-white outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                placeholder="+91 XXXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                inputMode="tel"
                required
                aria-label="Phone number"
              />
            </div>

            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 cursor-pointer rounded accent-orange-500"
                aria-label="Accept privacy policy"
              />
              <span className="text-sm leading-relaxed text-slate-400">
                I agree to the{" "}
                <Link
                  href="/privacy"
                  className="text-orange-400 underline-offset-2 transition-colors hover:text-orange-300 hover:underline"
                >
                  privacy policy
                </Link>
                {" / "}
                <span className="text-slate-500">मैं सहमत हूं</span>
              </span>
            </label>

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
              {phase === "locating" ? (
                <>
                  <MapPin className="h-4 w-4 animate-pulse" />
                  Getting location…
                </>
              ) : phase === "sending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending OTP…
                </>
              ) : (
                <>
                  Send OTP
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-slate-600">
          <Link href="/" className="transition-colors hover:text-slate-400">
            ← Back to Home
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function OnboardPage() {
  return (
    <Suspense>
      <OnboardForm />
    </Suspense>
  );
}
