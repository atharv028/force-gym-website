import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { normalizeIndianPhone } from "@/lib/otp";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = (await req.json()) as Record<string, unknown>;
  const updates: Record<string, unknown> = {};
  if (typeof body.name === "string") updates.name = body.name.trim();
  if (typeof body.phone === "string") {
    const normalized = normalizeIndianPhone(body.phone);
    if (!normalized) return NextResponse.json({ error: "Invalid phone", code: "INVALID_PHONE" }, { status: 400 });
    updates.phone = normalized;
  }
  if (typeof body.membership_expires_on === "string" || body.membership_expires_on === null) {
    updates.membership_expires_on = body.membership_expires_on;
  }
  if (typeof body.active === "boolean") updates.active = body.active;
  if (typeof body.photo_url === "string" || body.photo_url === null) updates.photo_url = body.photo_url;

  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase.from("members").update(updates).eq("id", params.id).select("*").single();
  if (error) return NextResponse.json({ error: error.message, code: "UPDATE_FAILED" }, { status: 400 });
  return NextResponse.json({ member: data });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = createServiceSupabaseClient();
  const { error } = await supabase.from("members").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message, code: "DELETE_FAILED" }, { status: 400 });
  return NextResponse.json({ success: true });
}
