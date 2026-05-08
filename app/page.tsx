import Link from "next/link";
import { FORCE_ONE_FITNESS } from "@/lib/business";
import {
  MapPin,
  Clock,
  Star,
  Users,
  Dumbbell,
  Activity,
  UserCheck,
  TrendingUp,
  Shield,
  Zap,
  Check,
  ChevronRight,
  Instagram,
} from "lucide-react";

const highlights = [
  "Elite strength and fat-loss focused programming",
  "Community-driven coaching and accountability",
  "High-energy sessions designed for consistency",
];

const features = [
  {
    icon: Dumbbell,
    title: "Strength Zone",
    description: "Barbells, dumbbells 2.5–50 kg, power racks, and Olympic platforms for serious lifters.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-400/20",
    glow: "hover:shadow-[0_8px_32px_rgba(249,115,22,0.15)]",
  },
  {
    icon: Activity,
    title: "Cardio Suite",
    description: "Treadmills, stationary bikes, and cross-trainers for high-intensity cardio sessions.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-400/20",
    glow: "hover:shadow-[0_8px_32px_rgba(34,197,94,0.12)]",
  },
  {
    icon: UserCheck,
    title: "Expert Coaching",
    description: "Certified personal trainers who build customised plans tailored to your body and goals.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-400/20",
    glow: "hover:shadow-[0_8px_32px_rgba(59,130,246,0.12)]",
  },
  {
    icon: Users,
    title: "Group Sessions",
    description: "High-energy batch workouts that keep you accountable and motivated every single day.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-400/20",
    glow: "hover:shadow-[0_8px_32px_rgba(168,85,247,0.12)]",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Smart digital attendance and milestone tracking to keep your journey on record.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-400/20",
    glow: "hover:shadow-[0_8px_32px_rgba(234,179,8,0.12)]",
  },
  {
    icon: Shield,
    title: "Clean Facility",
    description: "Sanitised, well-maintained equipment and spaces. Your comfort is our standard.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-400/20",
    glow: "hover:shadow-[0_8px_32px_rgba(244,63,94,0.12)]",
  },
];

const plans = [
  {
    name: "Starter",
    badge: null,
    price: "₹999",
    period: "/month",
    description: "Perfect for beginners building a consistent gym habit from scratch.",
    perks: ["Full gym access", "3 days/week guidance", "Body composition assessment", "Community support"],
    cta: "Start Your Journey",
    cardCls: "border-white/10 bg-slate-900/60",
    ctaCls:
      "border border-white/20 bg-white/5 text-white hover:border-orange-400/40 hover:bg-orange-500/10",
    featured: false,
  },
  {
    name: "Transformation",
    badge: "Most Popular",
    price: "₹1,499",
    period: "/month",
    description: "Intensive support for serious body recomposition and fat-loss goals.",
    perks: [
      "Unlimited access",
      "Personalised program",
      "Nutrition guidance",
      "Weekly check-ins",
      "Progress photos",
    ],
    cta: "Get Your Plan",
    cardCls:
      "border-orange-400/40 bg-orange-500/[0.05] shadow-[0_0_60px_rgba(249,115,22,0.1)]",
    ctaCls:
      "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)] hover:brightness-110",
    featured: true,
  },
  {
    name: "Athlete",
    badge: null,
    price: "₹1,999",
    period: "/month",
    description: "Advanced performance programming for competitive and serious athletes.",
    perks: [
      "Unlimited access",
      "1-on-1 coaching",
      "Competition prep",
      "Performance analytics",
      "Recovery planning",
    ],
    cta: "Unlock Performance",
    cardCls: "border-white/10 bg-slate-900/60",
    ctaCls:
      "border border-white/20 bg-white/5 text-white hover:border-orange-400/40 hover:bg-orange-500/10",
    featured: false,
  },
];

const stats = [
  { label: "Google Rating", value: `${FORCE_ONE_FITNESS.rating}.0`, icon: Star, color: "text-orange-400" },
  { label: "Happy Members", value: `${FORCE_ONE_FITNESS.reviewCount}+`, icon: Users, color: "text-emerald-400" },
  { label: "Days Per Week", value: "6", icon: Clock, color: "text-blue-400" },
  { label: "Years Strong", value: "3+", icon: Zap, color: "text-purple-400" },
];

export default function HomePage() {
  return (
    <div className="relative bg-slate-950 text-slate-100">
      {/* Fixed ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-20 h-[32rem] w-[32rem] rounded-full bg-orange-500/12 blur-[120px] animate-pulse-soft"
        />
        <div
          className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-emerald-500/8 blur-[100px] animate-pulse-soft"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_4px_12px_rgba(249,115,22,0.4)] transition-shadow duration-200 group-hover:shadow-[0_4px_20px_rgba(249,115,22,0.6)]">
              <span className="font-barlow-condensed text-sm font-bold tracking-wider text-white">F1</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-barlow-condensed text-base font-bold uppercase leading-none tracking-wider text-white">
                Force One
              </p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">Fitness · Bhopal</p>
            </div>
          </Link>

          {/* Links */}
          <div className="hidden items-center gap-1 md:flex">
            {["Features", "Plans", "Contact"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors duration-150 hover:bg-white/5 hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/onboard"
            className="cta-pop rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(249,115,22,0.35)] transition-all duration-200 hover:brightness-110"
          >
            Join Now
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto flex min-h-dvh-safe w-full max-w-6xl items-center px-4 pb-16 pt-24 md:py-28">
        <div className="grid w-full gap-10 md:grid-cols-2 md:items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse-soft" />
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-orange-200">
                Bhopal&apos;s High-Performance Gym
              </span>
            </div>

            <h1 className="mt-5 font-barlow-condensed text-[3.5rem] font-bold uppercase leading-[0.88] tracking-tight text-white md:text-7xl lg:text-8xl">
              Train Hard.
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                Transform
              </span>
              <br />
              Faster.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300 md:text-lg">
              Premium coaching, focused sessions, and a high-performance environment at Ayodhya Bypass, Bhopal.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/onboard"
                className="cta-pop rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-7 py-3.5 font-semibold text-white shadow-[0_4px_20px_rgba(249,115,22,0.4)] transition-all duration-200 hover:brightness-110"
              >
                Start Today
              </Link>
              <a
                href={FORCE_ONE_FITNESS.maps}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/15 bg-white/[0.04] px-7 py-3.5 font-semibold text-slate-100 transition-all duration-200 hover:border-orange-400/40 hover:bg-orange-500/[0.08]"
              >
                View on Maps
              </a>
            </div>

            {/* Inline stats */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                <span className="text-sm font-semibold text-white">{FORCE_ONE_FITNESS.rating}.0</span>
                <span className="text-xs text-slate-500">Google</span>
              </div>
              <div className="h-3 w-px bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-white">{FORCE_ONE_FITNESS.reviewCount}+</span>
                <span className="text-xs text-slate-500">Reviews</span>
              </div>
              <div className="h-3 w-px bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-400">Mon–Sat · 5 AM – 11 AM</span>
              </div>
            </div>
          </div>

          {/* Right — floating card */}
          <div className="animate-float-gentle rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-300">
              Why Members Choose Us
            </p>
            <div className="mt-4 space-y-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-3"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                    <Check className="h-3 w-3 text-emerald-400" />
                  </div>
                  <p className="text-sm leading-relaxed text-slate-200">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-orange-400/20 bg-orange-500/[0.07] p-4">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                <p className="text-sm leading-relaxed text-orange-100/90">{FORCE_ONE_FITNESS.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div className="relative z-10 border-y border-white/[0.06] bg-slate-900/40 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/[0.06] md:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex flex-col items-center gap-2 px-4 py-7 text-center">
              <Icon className={`h-5 w-5 ${color}`} />
              <p className="font-barlow-condensed text-3xl font-bold uppercase text-white">{value}</p>
              <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
        <div className="mb-12 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange-300">
            World-Class Equipment
          </p>
          <h2 className="mt-3 font-barlow-condensed text-4xl font-bold uppercase text-white md:text-5xl lg:text-6xl">
            Everything You Need
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              to Dominate
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-400">
            From heavy iron to high-intensity cardio, Force One Fitness is built for every goal.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className={`group rounded-2xl border ${f.border} ${f.bg} p-5 transition-all duration-300 hover:-translate-y-1 ${f.glow}`}
            >
              <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border ${f.border} ${f.bg}`}
              >
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="font-barlow-condensed text-xl font-semibold uppercase text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Training Plans ── */}
      <section id="plans" className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
        <div className="mb-12 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange-300">Membership Plans</p>
          <h2 className="mt-3 font-barlow-condensed text-4xl font-bold uppercase text-white md:text-5xl">
            Find Your Plan
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-400">
            No hidden fees. Pick the plan that fits your goals and commitment level.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan, i) => (
            <article
              key={plan.name}
              className={`relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 ${plan.cardCls}`}
            >
              {plan.badge ? (
                <div className="absolute right-4 top-4 rounded-full border border-orange-400/40 bg-orange-500/20 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-orange-200">
                  {plan.badge}
                </div>
              ) : null}

              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Plan 0{i + 1}</p>
              <h3 className="mt-2 font-barlow-condensed text-3xl font-bold uppercase text-white">
                {plan.name}
              </h3>

              <div className="mt-3 flex items-end gap-1">
                <span className="font-barlow-condensed text-4xl font-bold text-white">{plan.price}</span>
                <span className="mb-1 text-sm text-slate-400">{plan.period}</span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">{plan.description}</p>

              <ul className="mt-5 space-y-2.5">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    {perk}
                  </li>
                ))}
              </ul>

              <Link
                href="/onboard"
                className={`cta-pop mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${plan.ctaCls}`}
              >
                {plan.cta}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── Instagram / Social ── */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-4">
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] py-4">
          <Instagram className="h-4 w-4 text-orange-300" />
          <span className="text-sm text-slate-400">Follow us for daily motivation and updates:</span>
          <a
            href={FORCE_ONE_FITNESS.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-orange-300 underline-offset-4 transition-colors hover:text-orange-200 hover:underline"
          >
            @force1fitness
          </a>
        </div>
      </div>

      {/* ── Contact & CTA ── */}
      <section id="contact" className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
        <div className="grid gap-5 md:grid-cols-2">
          {/* Contact info */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-7 backdrop-blur">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-300">
              Location &amp; Hours
            </p>
            <h3 className="mt-3 font-barlow-condensed text-3xl font-bold uppercase text-white">
              Visit Force One Fitness
            </h3>

            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                <p className="text-sm leading-relaxed text-slate-300">{FORCE_ONE_FITNESS.address}</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5">
                <Clock className="h-4 w-4 shrink-0 text-blue-400" />
                <p className="text-sm text-slate-300">{FORCE_ONE_FITNESS.openingHours}</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5">
                <Star className="h-4 w-4 shrink-0 fill-orange-400 text-orange-400" />
                <p className="text-sm text-slate-300">
                  {FORCE_ONE_FITNESS.rating}.0 stars · {FORCE_ONE_FITNESS.reviewCount}+ Google reviews
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={FORCE_ONE_FITNESS.maps}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-emerald-400"
              >
                Open in Maps
              </a>
              <a
                href={FORCE_ONE_FITNESS.reviewUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-100 transition-all duration-200 hover:border-orange-300 hover:text-orange-200"
              >
                Leave a Review
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="relative overflow-hidden rounded-3xl border border-orange-400/20 bg-gradient-to-br from-orange-500/15 via-orange-500/5 to-transparent p-7">
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">Ready to Start?</p>
            <h3 className="mt-3 font-barlow-condensed text-4xl font-bold uppercase leading-[0.9] text-white md:text-5xl">
              Your Next
              <br />
              PR Begins
              <br />
              Today.
            </h3>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-300">
              Scan in, train consistently, and build a stronger version of yourself — one session at a time.
            </p>
            <Link
              href="/onboard"
              className="cta-pop mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-950 transition-all duration-200 hover:bg-slate-100"
            >
              Get OTP &amp; Check In
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
                <span className="font-barlow-condensed text-sm font-bold text-white">F1</span>
              </div>
              <div>
                <p className="font-barlow-condensed text-base font-bold uppercase tracking-wider text-white">
                  Force One Fitness
                </p>
                <p className="text-xs text-slate-500">Ayodhya Bypass, Bhopal · MP 462041</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
              <a href="#features" className="transition-colors hover:text-white">Features</a>
              <a href="#plans" className="transition-colors hover:text-white">Plans</a>
              <a href="#contact" className="transition-colors hover:text-white">Contact</a>
              <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
              <a
                href={FORCE_ONE_FITNESS.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-orange-300"
              >
                <Instagram className="h-3.5 w-3.5" />
                @force1fitness
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-white/[0.06] pt-6 text-center text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Force One Fitness. All rights reserved. Bhopal, Madhya Pradesh, India.
          </div>
        </div>
      </footer>
    </div>
  );
}
