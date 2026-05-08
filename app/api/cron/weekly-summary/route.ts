import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { sendTemplate } from "@/lib/whatsapp";

function validateCronAuth(req: Request): boolean {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  return token === process.env.CRON_SECRET;
}

export async function GET(req: Request) {
  if (!validateCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }
  const supabase = createServiceSupabaseClient();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const { data: members } = await supabase.from("members").select("*").eq("active", true);

  let sent = 0;
  for (const member of members ?? []) {
    const { data: rows } = await supabase
      .from("daily_summary")
      .select("duration_min")
      .eq("member_id", member.id)
      .gte("date", weekAgo);
    const visits = rows?.length ?? 0;
    if (visits === 0) continue;
    const hours = ((rows ?? []).reduce((acc, r) => acc + (r.duration_min ?? 0), 0) / 60).toFixed(1);
    await sendTemplate(member.phone, "gym_weekly_summary", [member.name, String(visits), String(hours)]);
    sent += 1;
  }
  return NextResponse.json({ success: true, summaries_sent: sent });
}
