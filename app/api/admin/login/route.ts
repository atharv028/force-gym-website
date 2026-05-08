import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { signAdminJwt } from "@/lib/jwt";

export async function POST(req: Request) {
  const body = (await req.json()) as { username?: string; password?: string };
  const username = (body.username ?? "").trim();
  const password = body.password ?? "";
  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials", code: "INVALID_INPUT" }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  const { data: admin } = await supabase.from("admins").select("*").eq("username", username).maybeSingle();
  if (!admin) {
    return NextResponse.json({ error: "Invalid username or password", code: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, String(admin.password_hash));
  if (!ok) {
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
