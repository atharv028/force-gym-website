import Link from "next/link";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { Users, TrendingUp, Clock, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createServiceSupabaseClient();
  const today = new Date().toISOString().slice(0, 10);

  const [dailyRes, rejectedRes] = await Promise.all([
    supabase
      .from("daily_summary")
      .select("*, members(name)")
      .eq("date", today)
      .order("in_time", { ascending: false }),
    supabase
      .from("attendance_logs")
      .select("*, members(name)")
      .eq("rejected", true)
      .gte("scanned_at", `${today}T00:00:00.000Z`),
  ]);

  const daily = dailyRes.data ?? [];
  const rejected = rejectedRes.data ?? [];
  const currentlyIn = daily.filter((d) => !d.out_time).length;

  const metricCards = [
    {
      title: "Currently In Gym",
      value: String(currentlyIn),
      icon: Users,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-400/20",
    },
    {
      title: "Today's Visits",
      value: String(daily.length),
      icon: TrendingUp,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-400/20",
    },
    {
      title: "Rejected Scans",
      value: String(rejected.length),
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-400/20",
    },
    {
      title: "This Week",
      value: "—",
      icon: Clock,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-400/20",
      href: "/admin/reports",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange-300">
          Admin Dashboard
        </p>
        <h1 className="mt-1 font-barlow-condensed text-4xl font-bold uppercase text-white">
          Today&apos;s Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map(({ title, value, icon: Icon, color, bg, border, href }) => {
          const content = (
            <div
              className={`rounded-2xl border ${border} ${bg} p-5 transition-all duration-200 hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between">
                <div className={`rounded-xl border ${border} ${bg} p-2`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </div>
              <p className="mt-3 font-barlow-condensed text-3xl font-bold text-white">{value}</p>
              <p className="mt-0.5 text-xs uppercase tracking-wider text-slate-500">{title}</p>
            </div>
          );
          return href ? (
            <Link key={title} href={href} className="block">
              {content}
            </Link>
          ) : (
            <div key={title}>{content}</div>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-2.5">
        {[
          { href: "/admin/members", label: "Manage Members" },
          { href: "/admin/reports", label: "View Reports" },
          { href: "/admin/settings", label: "QR Settings" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-150 hover:border-orange-400/30 hover:bg-orange-500/[0.08] hover:text-white"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Today's attendance */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-barlow-condensed text-2xl font-semibold uppercase text-white">
            Today&apos;s Attendance
          </h2>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
            {daily.length} entries
          </span>
        </div>

        {daily.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <p className="text-sm text-slate-500">No attendance recorded today yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.03]">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Member
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      In
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Out
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {daily.map((row) => (
                    <tr
                      key={row.member_id}
                      className="bg-slate-900/30 transition-colors duration-100 hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-3 font-medium text-white">
                        {((row as { members?: { name?: string } }).members?.name ?? "Unknown")}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{row.in_time ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-300">{row.out_time ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            row.out_time
                              ? "bg-slate-800 text-slate-400"
                              : "bg-emerald-500/15 text-emerald-300"
                          }`}
                        >
                          {row.out_time ? "Checked Out" : "In Gym"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Rejected scans */}
      {rejected.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <h2 className="font-barlow-condensed text-2xl font-semibold uppercase text-white">
              Rejected Scans
            </h2>
            <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-0.5 text-xs text-red-300">
              {rejected.length}
            </span>
          </div>

          <div className="space-y-2">
            {rejected.map((row) => (
              <div
                key={row.id}
                className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {((row as { members?: { name?: string } }).members?.name ?? "Unknown")}
                  </p>
                  <p className="mt-0.5 text-xs text-red-300">{row.rejection_reason}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
