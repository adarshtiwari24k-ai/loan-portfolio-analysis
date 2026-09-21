"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  MAX_FILE_SIZE_BYTES,
  MAX_AGE,
  MIN_AGE,
  isPdfFile,
} from "@/lib/validation";

export default function UploadPage() {
  const router = useRouter();
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [age, setAge] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): string | null {
    if (gender !== "male" && gender !== "female") {
      return "Please select Male or Female.";
    }
    const ageNum = Number(age);
    if (!age || !Number.isInteger(ageNum) || ageNum < MIN_AGE || ageNum > MAX_AGE) {
      return `Please enter a valid age between ${MIN_AGE} and ${MAX_AGE}.`;
    }
    if (!file) {
      return "Please attach a biodata PDF file.";
    }
    if (!isPdfFile(file)) {
      return "Only PDF files are accepted.";
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return "The PDF must be 1 MB or smaller.";
    }
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.set("gender", gender);
      formData.set("age", age);
      formData.set("file", file as File);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push(`/biodatas/${data.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Upload Biodata</h1>

      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Please upload only information that you are comfortable making
        publicly available. Once published, this PDF and the files inside
        it (name, contact details, photos, etc.) will be publicly
        accessible to anyone who visits this site — there is no login or
        approval step.
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        <fieldset>
          <legend className="mb-2 block text-sm font-semibold text-gray-900">
            Gender
          </legend>
          <div className="flex gap-3">
            {(["male", "female"] as const).map((option) => (
              <label
                key={option}
                className={`flex-1 cursor-pointer rounded-md border px-4 py-3 text-center text-sm font-medium capitalize ${
                  gender === option
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={gender === option}
                  onChange={() => setGender(option)}
                  className="sr-only"
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="age" className="mb-2 block text-sm font-semibold text-gray-900">
            Age
          </label>
          <input
            id="age"
            type="number"
            inputMode="numeric"
            min={MIN_AGE}
            max={MAX_AGE}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder={`${MIN_AGE}–${MAX_AGE}`}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:border-gray-900 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="file" className="mb-2 block text-sm font-semibold text-gray-900">
            Biodata (PDF, max 1 MB)
          </label>
          <input
            id="file"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-base file:mr-4 file:rounded file:border-0 file:bg-gray-900 file:px-3 file:py-2 file:text-white"
          />
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-gray-900 px-6 py-4 text-base font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {submitting ? "Publishing…" : "Publish Biodata"}
        </button>
      </form>
    </div>
  );
}
