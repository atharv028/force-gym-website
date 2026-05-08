import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (!from || !to) return NextResponse.json({ error: "Missing date range", code: "INVALID_INPUT" }, { status: 400 });

  const supabase = createServiceSupabaseClient();
  const [{ data: logs }, { data: summaries }, { data: members }] = await Promise.all([
    supabase.from("attendance_logs").select("*, members(name, phone)").gte("scanned_at", from).lte("scanned_at", `${to}T23:59:59.999Z`),
    supabase.from("daily_summary").select("*, members(name, phone)").gte("date", from).lte("date", to),
    supabase.from("members").select("*"),
  ]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet((summaries ?? []).map((r) => ({
      date: r.date,
      member: (r as { members?: { name?: string } }).members?.name ?? "",
      phone: (r as { members?: { phone?: string } }).members?.phone ?? "",
      in_time: r.in_time ?? "",
      out_time: r.out_time ?? "",
      duration_min: r.duration_min ?? 0,
      scan_count: r.scan_count ?? 0,
    }))),
    "Daily Summary",
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet((logs ?? []).map((r) => ({
      timestamp: r.scanned_at,
      member: (r as { members?: { name?: string } }).members?.name ?? "",
      rejected: r.rejected ? "yes" : "no",
      reason: r.rejection_reason ?? "",
      lat: r.lat ?? "",
      lng: r.lng ?? "",
      distance_m: r.distance_m ?? "",
    }))),
    "Raw Logs",
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet((members ?? []).map((m) => ({ name: m.name, phone: m.phone, joined_on: m.joined_on, expires_on: m.membership_expires_on }))),
    "Member Stats",
  );

  const file = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
  const filename = `gym-attendance-${from}-to-${to}.xlsx`;
  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
