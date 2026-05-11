import bcrypt from "bcryptjs";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { sendTemplate } from "@/lib/whatsapp";

export function normalizeIndianPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  const ten = digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;
  if (!/^\d{10}$/.test(ten)) return null;
  return `+91${ten}`;
}

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function createAndSendOtp(
  phone: string,
): Promise<{ ok: boolean; error?: string; code?: string }> {
  const supabase = createServiceSupabaseClient();

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("otps")
    .select("*", { count: "exact", head: true })
    .eq("phone", phone)
    .gte("created_at", oneHourAgo);

  const code = generateOtpCode();
  console.log("code", code);
  const codeHash = await bcrypt.hash(code, 12);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const { error: insertError } = await supabase
    .from("otps")
    .insert({ phone, code_hash: codeHash, expires_at: expiresAt });
  if (insertError) {
    return { ok: false, error: "Could not create OTP." };
  }

  const wa = await sendTemplate(phone, "gym_otp_2", [code], ["Login"]);
  if (!wa.success) {
    return { ok: false, error: wa.error ?? "WhatsApp delivery failed." };
  }

  return { ok: true, code };
}

export async function verifyOtpCode(phone: string, code: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = createServiceSupabaseClient();

  const { data: otp, error } = await supabase
    .from("otps")
    .select("*")
    .eq("phone", phone)
    .eq("used", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !otp) return { ok: false, error: "OTP not found." };

  if (new Date(otp.expires_at).getTime() < Date.now()) {
    return { ok: false, error: "OTP expired." };
  }
  const matched = await bcrypt.compare(code, String(otp.code_hash));
  if (!matched) {
    return { ok: false, error: "Invalid OTP." };
  }

  await supabase.from("otps").update({ used: true }).eq("id", otp.id);
  return { ok: true };
}
