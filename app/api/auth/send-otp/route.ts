import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { createAndSendOtp, normalizeIndianPhone } from "@/lib/otp";
import { haversineDistanceMeters } from "@/lib/geo";
import { FORCE_ONE_FITNESS } from "@/lib/business";

const MAX_OTP_RADIUS_M = 300;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { phone?: string; lat?: unknown; lng?: unknown };

    // Validate location before anything else to avoid unnecessary DB/OTP costs
    const lat = typeof body.lat === "number" ? body.lat : null;
    const lng = typeof body.lng === "number" ? body.lng : null;

    if (lat === null || lng === null) {
      return NextResponse.json(
        { error: "Location is required to check in. Please enable GPS.", code: "LOCATION_MISSING" },
        { status: 400 },
      );
    }

    const distanceM = haversineDistanceMeters(lat, lng, FORCE_ONE_FITNESS.latitude, FORCE_ONE_FITNESS.longitude);
    if (distanceM > MAX_OTP_RADIUS_M) {
      return NextResponse.json(
        {
          error: `You must be at the gym to check in. You are ${distanceM} m away. / जिम में उपस्थित होकर चेक-इन करें।`,
          code: "TOO_FAR",
          distanceM,
        },
        { status: 403 },
      );
    }

    const normalized = normalizeIndianPhone(body.phone ?? "");
    if (!normalized) {
      return NextResponse.json({ error: "Invalid phone format", code: "INVALID_PHONE" }, { status: 400 });
    }

    const supabase = createServiceSupabaseClient();
    const { data: member } = await supabase
      .from("members")
      .select("id")
      .eq("phone", normalized)
      .maybeSingle();

    if (!member) {
      return NextResponse.json(
        { error: "Please ask gym staff to register you first.", code: "MEMBER_NOT_FOUND" },
        { status: 404 },
      );
    }

    const result = await createAndSendOtp(normalized);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "Failed to send OTP", code: "OTP_SEND_FAILED" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unexpected error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
