import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  MAX_FILE_SIZE_BYTES,
  isPdfFile,
  isValidAge,
  isValidGender,
} from "@/lib/validation";

export const runtime = "nodejs";

function isPdfMagicBytes(bytes: Uint8Array): boolean {
  // A real PDF file starts with the bytes for "%PDF-".
  const header = [0x25, 0x50, 0x44, 0x46, 0x2d];
  return header.every((byte, i) => bytes[i] === byte);
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const gender = formData.get("gender");
  const ageRaw = formData.get("age");
  const file = formData.get("file");

  if (!isValidGender(gender)) {
    return NextResponse.json(
      { error: "Please select Male or Female." },
      { status: 400 }
    );
  }

  if (!isValidAge(ageRaw)) {
    return NextResponse.json(
      { error: "Please enter a valid age between 18 and 70." },
      { status: 400 }
    );
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Please attach a biodata PDF file." },
      { status: 400 }
    );
  }

  if (!isPdfFile(file)) {
    return NextResponse.json(
      { error: "Only PDF files are accepted." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "The PDF must be 1 MB or smaller." },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  if (!isPdfMagicBytes(bytes)) {
    return NextResponse.json(
      { error: "The uploaded file does not look like a valid PDF." },
      { status: 400 }
    );
  }

  const age = Number(ageRaw);
  const storagePath = `${randomUUID()}.pdf`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("biodatas")
    .upload(storagePath, bytes, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: "Could not upload the file. Please try again." },
      { status: 500 }
    );
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("biodatas").getPublicUrl(storagePath);

  const { data: biodata, error: insertError } = await supabaseAdmin
    .from("biodatas")
    .insert({ gender, age, file_url: publicUrl })
    .select("id")
    .single();

  if (insertError || !biodata) {
    // Clean up the uploaded file if we couldn't save the database row.
    await supabaseAdmin.storage.from("biodatas").remove([storagePath]);
    return NextResponse.json(
      { error: "Could not save the biodata. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: biodata.id }, { status: 201 });
}
