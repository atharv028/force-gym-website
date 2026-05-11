import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { verifyMemberJwt } from "@/lib/jwt";
import { haversineDistanceMeters } from "@/lib/geo";
import { getAttendanceDateForConfig } from "@/lib/attendance";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { lat?: number; lng?: number };
    if (typeof body.lat !== "number" || typeof body.lng !== "number") {
      return NextResponse.json({ error: "Invalid coordinates", code: "INVALID_INPUT" }, { status: 400 });
    }

    const token = cookies().get("member_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    const payload = await verifyMemberJwt(token);

    const supabase = createServiceSupabaseClient();
    const { data: member } = await supabase.from("members").select("*").eq("id", payload.member_id).maybeSingle();
    if (!member) return NextResponse.json({ error: "Member not found", code: "MEMBER_NOT_FOUND" }, { status: 404 });

    if (member.membership_expires_on && new Date(member.membership_expires_on) < new Date()) {
      return NextResponse.json({ error: "Membership expired", code: "MEMBERSHIP_EXPIRED" }, { status: 403 });
    }

    const { data: config } = await supabase.from("gym_config").select("*").eq("id", 1).single();
    const distance = haversineDistanceMeters(body.lat, body.lng, config.gym_lat, config.gym_lng);
    if (distance > config.allowed_radius_m) {
      await supabase.from("attendance_logs").insert({
        member_id: member.id,
        lat: body.lat,
        lng: body.lng,
        distance_m: distance,
        rejected: true,
        rejection_reason: "OUTSIDE_ALLOWED_RADIUS",
      });
      return NextResponse.json({ error: "You are outside the allowed radius. Please move inside the gym to check in.", code: "OUTSIDE_RADIUS" }, { status: 403 });
    }

    const today = getAttendanceDateForConfig(new Date(), config.closing_hour);
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString();
    const { data: recent } = await supabase
      .from("attendance_logs")
      .select("id")
      .eq("member_id", member.id)
      .gte("scanned_at", thirtySecondsAgo)
      .eq("rejected", false)
      .limit(1)
      .maybeSingle();

    if (recent) {
      return NextResponse.json({ error: "Duplicate scan", code: "IDEMPOTENT_SKIP" }, { status: 200 });
    }

    await supabase.from("attendance_logs").insert({
      member_id: member.id,
      lat: body.lat,
      lng: body.lng,
      distance_m: distance,
      rejected: false,
    });

    const { data: existing } = await supabase
      .from("daily_summary")
      .select("*")
      .eq("date", today)
      .eq("member_id", member.id)
      .maybeSingle();

    const nowIso = new Date().toISOString();
    let status: "in" | "out" = "in";
    let durationMin = 0;

    if (!existing) {
      await supabase.from("daily_summary").insert({
        date: today,
        member_id: member.id,
        in_time: nowIso,
        scan_count: 1,
      });
      status = "in";
    } else {
      status = "out";
      durationMin = Math.max(0, Math.floor((Date.now() - new Date(existing.in_time).getTime()) / 60000));
      await supabase
        .from("daily_summary")
        .update({
          out_time: nowIso,
          scan_count: (existing.scan_count ?? 0) + 1,
          duration_min: durationMin,
        })
        .eq("date", today)
        .eq("member_id", member.id);
    }

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const { count } = await supabase
      .from("daily_summary")
      .select("*", { count: "exact", head: true })
      .eq("member_id", member.id)
      .gte("date", weekAgo);

    return NextResponse.json({
      status,
      name: member.name,
      in_time: existing?.in_time ?? nowIso,
      out_time: status === "out" ? nowIso : null,
      duration_min: status === "out" ? durationMin : null,
      weekly_count: count ?? 0,
    });
  } catch {
    return NextResponse.json({ error: "Unexpected error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
