import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { normalizeIndianPhone, verifyOtpCode } from "@/lib/otp";
import { signMemberJwt } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { phone?: string; code?: string; next?: string };
    const phone = normalizeIndianPhone(body.phone ?? "");
    const code = (body.code ?? "").trim();
    if (!phone || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Invalid input", code: "INVALID_INPUT" }, { status: 400 });
    }

    const verify = await verifyOtpCode(phone, code);
    if (!verify.ok) {
      return NextResponse.json({ error: verify.error ?? "OTP verification failed", code: "OTP_INVALID" }, { status: 400 });
    }

    const supabase = createServiceSupabaseClient();
    const { data: member } = await supabase
      .from("members")
      .select("id, phone")
      .eq("phone", phone)
      .eq("active", true)
      .maybeSingle();
    if (!member) {
      return NextResponse.json({ error: "Member not active", code: "MEMBER_NOT_ACTIVE" }, { status: 403 });
    }

    const rawSessionToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawSessionToken).digest("hex");
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

    const { data: session, error } = await supabase
      .from("sessions")
      .insert({ member_id: member.id, token_hash: tokenHash, expires_at: expiresAt })
      .select("id")
      .single();

    if (error || !session) {
      return NextResponse.json({ error: "Session creation failed", code: "SESSION_CREATE_FAILED" }, { status: 500 });
    }

    const jwt = await signMemberJwt({ member_id: member.id, session_id: session.id });
    cookies().set("member_session", jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 90 * 24 * 60 * 60,
    });

    return NextResponse.json({ success: true, redirectTo: body.next || "/scan" });
  } catch {
    return NextResponse.json({ error: "Unexpected error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
