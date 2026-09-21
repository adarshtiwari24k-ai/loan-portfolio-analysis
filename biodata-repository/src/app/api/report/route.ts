import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isValidReportReason } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { biodataId, reason } = (body ?? {}) as {
    biodataId?: unknown;
    reason?: unknown;
  };

  if (typeof biodataId !== "string" || biodataId.length === 0) {
    return NextResponse.json({ error: "Missing biodata." }, { status: 400 });
  }

  if (!isValidReportReason(reason)) {
    return NextResponse.json(
      { error: "Please select a reason for the report." },
      { status: 400 }
    );
  }

  const { data: biodata, error: lookupError } = await supabaseAdmin
    .from("biodatas")
    .select("id")
    .eq("id", biodataId)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json(
      { error: "Could not submit the report. Please try again." },
      { status: 500 }
    );
  }

  if (!biodata) {
    return NextResponse.json({ error: "Biodata not found." }, { status: 404 });
  }

  const { error: insertError } = await supabaseAdmin
    .from("reports")
    .insert({ biodata_id: biodataId, reason });

  if (insertError) {
    return NextResponse.json(
      { error: "Could not submit the report. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
