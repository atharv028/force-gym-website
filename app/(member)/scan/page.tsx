"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FORCE_ONE_FITNESS } from "@/lib/business";
import { CheckCircle, XCircle, Loader2, MapPin, Clock } from "lucide-react";
import Link from "next/link";

type MarkResult = {
  status: "in" | "out";
  name: string;
  in_time?: string;
  out_time?: string | null;
  duration_min?: number | null;
  weekly_count?: number;
};

function ScanContent() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<MarkResult | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const token = useMemo(() => params.get("t"), [params]);

  useEffect(() => {
    async function run() {
      if (!token) {
        setStatus("error");
        setMessage("Invalid QR code. Please ask gym staff for a fresh code.");
        return;
      }

      setStatus("loading");
      const validate = await fetch(`/api/attendance/validate-qr?t=${encodeURIComponent(token)}`);
      if (!validate.ok) {
        setStatus("error");
        setMessage("QR expired — please ask gym staff for a new one. / QR एक्सपायर हो गया है।");
        return;
      }

      if (!navigator.geolocation) {
        setStatus("error");
        setMessage("Geolocation is not supported on this device.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (pos.coords.accuracy > 100) {
            setStatus("error");
            setMessage("GPS accuracy is too low. Please step outside and retry.");
            return;
          }
          const mark = await fetch("/api/attendance/mark", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          });
          if (mark.status === 401) {
            router.push(`/onboard?next=${encodeURIComponent(`/scan?t=${token}`)}`);
            return;
          }
          const data = (await mark.json()) as MarkResult & { error?: string };
          if (!mark.ok) {
            setStatus("error");
            setMessage(data.error ?? "Attendance marking failed. Please try again.");
            return;
          }
          setResult(data);
          setStatus("success");
          setTimeout(() => router.push("/onboard"), 5000);
        },
        () => {
          setStatus("error");
          setMessage("Location access denied. Please enable location and retry. / कृपया लोकेशन ऑन करें।");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
      );
    }
    void run();
  }, [router, token]);

  return (
    <main className="relative flex min-h-dvh-safe flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_5%,rgba(249,115,22,0.18),transparent_36%),radial-gradient(circle_at_85%_85%,rgba(34,197,94,0.16),transparent_34%)]" />

      {/* Brand */}
      <div className="relative mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_4px_16px_rgba(249,115,22,0.4)]">
          <span className="font-barlow-condensed text-sm font-bold text-white">F1</span>
        </div>
        <div>
          <p className="font-barlow-condensed text-base font-bold uppercase leading-none tracking-wider text-white">
            {FORCE_ONE_FITNESS.name}
          </p>
          <p className="mt-0.5 text-xs uppercase tracking-widest text-slate-500">Live Session</p>
        </div>
      </div>

      {/* Status card */}
      <div className="relative w-full max-w-sm">
        {status === "loading" && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-orange-400/20 bg-orange-500/10">
              <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
            </div>
            <h2 className="font-barlow-condensed text-2xl font-bold uppercase text-white">
              Checking In…
            </h2>
            <p className="mt-2 text-sm text-slate-400">Getting your location and marking attendance</p>
            <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-slate-400">Verifying gym location…</span>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-3xl border border-red-500/20 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="font-barlow-condensed text-2xl font-bold uppercase text-white">
              Check-in Failed
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-red-300">{message}</p>
            <Link
              href="/onboard"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:border-orange-400/40 hover:bg-orange-500/10"
            >
              Try Again
            </Link>
          </div>
        )}

        {status === "success" && result && (
          <div className="rounded-3xl border border-emerald-400/20 bg-slate-900/80 p-8 text-center shadow-[0_0_60px_rgba(34,197,94,0.1)] backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/15">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-300">
              Attendance Marked
            </p>
            <h2 className="mt-2 font-barlow-condensed text-3xl font-bold uppercase text-white">
              Welcome, {result.name}!
            </h2>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5">
              <span className="text-sm font-semibold text-emerald-300">
                Marked {result.status === "in" ? "CHECK-IN" : "CHECK-OUT"}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {result.in_time && (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                  <p className="text-xs uppercase tracking-wider text-slate-500">In Time</p>
                  <p className="mt-1 text-sm font-semibold text-white">{result.in_time}</p>
                </div>
              )}
              {typeof result.weekly_count === "number" && (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                  <p className="text-xs uppercase tracking-wider text-slate-500">This Week</p>
                  <p className="mt-1 text-sm font-semibold text-white">{result.weekly_count} visits</p>
                </div>
              )}
            </div>

            {result.duration_min != null && (
              <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                <Clock className="h-4 w-4 text-blue-400" />
                <p className="text-sm text-slate-300">Session: {result.duration_min} min</p>
              </div>
            )}

            <p className="mt-5 text-xs text-slate-500">Redirecting in a moment…</p>
          </div>
        )}

        {status === "idle" && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
            <h2 className="font-barlow-condensed text-2xl font-bold uppercase text-white">
              Initialising…
            </h2>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ScanPage() {
  return (
    <Suspense>
      <ScanContent />
    </Suspense>
  );
}
