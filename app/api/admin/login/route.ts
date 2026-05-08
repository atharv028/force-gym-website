import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { signAdminJwt } from "@/lib/jwt";

const attempts = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(username: string): boolean {
  const now = Date.now();
  const existing = attempts.get(username);
  if (!existing || now - existing.windowStart > 60 * 60 * 1000) {
    attempts.set(username, { count: 0, windowStart: now });
    return false;
  }
  return existing.count >= 5;
}

function addFail(username: string) {
  const now = Date.now();
  const existing = attempts.get(username);
  if (!existing || now - existing.windowStart > 60 * 60 * 1000) {
    attempts.set(username, { count: 1, windowStart: now });
    return;
  }
  attempts.set(username, { ...existing, count: existing.count + 1 });
}

export async function POST(req: Request) {
  const body = (await req.json()) as { username?: string; password?: string };
  const username = (body.username ?? "").trim();
  const password = body.password ?? "";
  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials", code: "INVALID_INPUT" }, { status: 400 });
  }
  if (isRateLimited(username)) {
    return NextResponse.json({ error: "Too many attempts", code: "RATE_LIMITED" }, { status: 429 });
  }

  const supabase = createServiceSupabaseClient();
  const { data: admin } = await supabase.from("admins").select("*").eq("username", username).maybeSingle();
  if (!admin) {
    addFail(username);
    return NextResponse.json({ error: "Invalid username or password", code: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, String(admin.password_hash));
  if (!ok) {
    addFail(username);
    return NextResponse.json({ error: "Invalid username or password", code: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  const token = await signAdminJwt({ admin_id: admin.id, username: admin.username });
  cookies().set("admin_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
  return NextResponse.json({ success: true });
}
