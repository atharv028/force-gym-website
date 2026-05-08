import { BarChart3, Download, Calendar } from "lucide-react";

export default function ReportsPage() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const to = now.toISOString().slice(0, 10);
  const href = `/api/admin/export?from=${from}&to=${to}`;

  const monthName = now.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange-300">Analytics</p>
        <h1 className="mt-1 font-barlow-condensed text-4xl font-bold uppercase text-white">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">Export attendance data for analysis and records.</p>
      </div>

      {/* Export card */}
      <div className="max-w-lg rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10">
          <BarChart3 className="h-5 w-5 text-orange-400" />
        </div>

        <h2 className="font-barlow-condensed text-2xl font-bold uppercase text-white">
          Monthly Export
        </h2>
        <p className="mt-1.5 text-sm text-slate-400">
          Download a full attendance report for the current month as an Excel spreadsheet.
        </p>

        <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5">
          <Calendar className="h-5 w-5 shrink-0 text-blue-400" />
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Report Period</p>
            <p className="mt-0.5 text-sm font-medium text-white">{monthName}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-slate-500">
              {from} → {to}
            </p>
          </div>
        </div>

        <a
          href={href}
          download
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-3 font-semibold text-white shadow-[0_4px_16px_rgba(249,115,22,0.3)] transition-all duration-200 hover:brightness-110"
        >
          <Download className="h-4 w-4" />
          Download Excel Report
        </a>
      </div>

      {/* Info note */}
      <div className="max-w-lg rounded-xl border border-blue-400/15 bg-blue-500/[0.06] px-4 py-3.5">
        <p className="text-xs leading-relaxed text-blue-300">
          The exported file includes member names, check-in times, check-out times, session
          durations, and weekly visit counts for the selected date range.
        </p>
      </div>
    </div>
  );
}
