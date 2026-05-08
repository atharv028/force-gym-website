import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

function validateCronAuth(req: Request): boolean {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  return token === process.env.CRON_SECRET;
}

export async function GET(req: Request) {
  if (!validateCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }
  const supabase = createServiceSupabaseClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data: rows } = await supabase.from("daily_summary").select("*").eq("date", today).is("out_time", null);
  for (const row of rows ?? []) {
    const outIso = `${today}T17:30:00.000Z`;
    const duration = row.in_time ? Math.max(0, Math.floor((new Date(outIso).getTime() - new Date(row.in_time).getTime()) / 60000)) : 0;
    await supabase.from("daily_summary").update({ out_time: outIso, duration_min: duration }).eq("date", today).eq("member_id", row.member_id);
  }
  return NextResponse.json({ success: true, closed: rows?.length ?? 0 });
}
