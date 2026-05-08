import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { normalizeIndianPhone } from "@/lib/otp";

export async function GET() {
  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Failed to fetch members", code: "FETCH_FAILED" }, { status: 500 });
  return NextResponse.json({ members: data });
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    name?: string;
    phone?: string;
    membership_expires_on?: string;
    photo_url?: string;
  };

  const name = (body.name ?? "").trim();
  const phone = normalizeIndianPhone(body.phone ?? "");
  if (!name || !phone) {
    return NextResponse.json({ error: "Invalid input", code: "INVALID_INPUT" }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase
    .from("members")
    .insert({
      name,
      phone,
      membership_expires_on: body.membership_expires_on ?? null,
      photo_url: body.photo_url ?? null,
      active: true,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message, code: "CREATE_FAILED" }, { status: 400 });
  return NextResponse.json({ member: data });
}
