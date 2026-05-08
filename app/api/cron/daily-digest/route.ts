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
  const today = new Date().toISOString().slice(0, 10);
  const { data: summaries } = await supabase.from("daily_summary").select("*").eq("date", today);
  const { data: config } = await supabase.from("gym_config").select("*").eq("id", 1).single();

  const visitCount = summaries?.length ?? 0;
  const currentlyActive = (summaries ?? []).filter((s) => !s.out_time).length;
  const totalHours = ((summaries ?? []).reduce((acc, s) => acc + (s.duration_min ?? 0), 0) / 60).toFixed(1);

  if (config.owner_phone) {
    await sendTemplate(config.owner_phone, "gym_daily_digest", [
      String(visitCount),
      String(currentlyActive),
      String(totalHours),
    ]);
  }
  return NextResponse.json({ success: true });
}
