import crypto from "crypto";
import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function POST() {
  const token = crypto.randomBytes(24).toString("hex");
  const supabase = createServiceSupabaseClient();

  const { error } = await supabase
    .from("gym_config")
    .update({ qr_token: token, qr_token_rotated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return NextResponse.json({ error: "Failed to rotate token", code: "ROTATE_FAILED" }, { status: 500 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const scanUrl = `${appUrl}/scan?t=${token}`;
  const qrPngDataUrl = await QRCode.toDataURL(scanUrl);

  return NextResponse.json({ token, scan_url: scanUrl, qr_png_data_url: qrPngDataUrl });
}
