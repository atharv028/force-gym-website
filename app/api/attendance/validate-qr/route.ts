import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("t");
  if (!token) return NextResponse.json({ error: "Missing token", code: "INVALID_INPUT" }, { status: 400 });
  const supabase = createServiceSupabaseClient();
  const { data: config } = await supabase.from("gym_config").select("qr_token").eq("id", 1).single();
  if (!config || config.qr_token !== token) {
    return NextResponse.json({ error: "QR expired", code: "QR_EXPIRED" }, { status: 403 });
  }
  return NextResponse.json({ success: true });
}
