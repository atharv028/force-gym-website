import { FORCE_ONE_FITNESS } from "@/lib/business";
import Link from "next/link";
import { ShieldCheck, Instagram } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="relative min-h-dvh-safe overflow-hidden bg-slate-950 px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(249,115,22,0.12),transparent_38%)]" />

      <div className="relative mx-auto max-w-xl">
        {/* Brand */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_4px_12px_rgba(249,115,22,0.4)]">
            <span className="font-barlow-condensed text-sm font-bold text-white">F1</span>
          </div>
          <p className="font-barlow-condensed text-base font-bold uppercase tracking-wider text-white">
            Force One Fitness
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-7 shadow-xl backdrop-blur">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>

          <h1 className="font-barlow-condensed text-4xl font-bold uppercase text-white">
            Privacy Notice
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">गोपनीयता सूचना</p>

          <div className="mt-6 space-y-4 text-sm leading-relaxed">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <p className="text-slate-300">
                We collect your <strong className="text-white">phone number</strong>,{" "}
                <strong className="text-white">attendance timestamps</strong>, and{" "}
                <strong className="text-white">scan location</strong> solely for the purpose of gym
                attendance tracking.
              </p>
              <p className="mt-2 text-slate-500">
                हम केवल उपस्थिति हेतु आपका फोन नंबर, समय और लोकेशन लेते हैं।
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <p className="text-slate-300">
                Your data is <strong className="text-white">never sold or shared</strong> with third
                parties. It is used exclusively within Force One Fitness for attendance management.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <p className="text-slate-400">
                To request deletion or correction of your data, contact gym staff in person or reach
                out via our Instagram profile below.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-orange-300 transition-all duration-200 hover:border-orange-400/40 hover:text-orange-200"
              href={FORCE_ONE_FITNESS.instagram}
              target="_blank"
              rel="noreferrer"
            >
              <Instagram className="h-4 w-4" />
              @{FORCE_ONE_FITNESS.instagram.split("/")[3]}
            </a>
            <Link
              href="/"
              className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:border-white/20 hover:text-white"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
