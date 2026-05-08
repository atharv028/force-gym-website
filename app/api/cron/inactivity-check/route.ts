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
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: members } = await supabase
    .from("members")
    .select("*")
    .eq("active", true)
    .gt("membership_expires_on", new Date().toISOString().slice(0, 10));

  let sent = 0;
  for (const member of members ?? []) {
    const { count } = await supabase
      .from("daily_summary")
      .select("*", { count: "exact", head: true })
      .eq("member_id", member.id)
      .gte("date", fiveDaysAgo);
    if ((count ?? 0) > 0) continue;

    const { count: alreadySent } = await supabase
      .from("reminder_log")
      .select("*", { count: "exact", head: true })
      .eq("member_id", member.id)
      .eq("reminder_type", "inactivity")
      .gte("sent_at", sevenDaysAgo);
    if ((alreadySent ?? 0) > 0) continue;

    await sendTemplate(member.phone, "gym_inactivity_reminder", [member.name, "5 days"]);
    await supabase.from("reminder_log").insert({ member_id: member.id, reminder_type: "inactivity" });
    sent += 1;
  }
  return NextResponse.json({ success: true, reminders_sent: sent });
}
