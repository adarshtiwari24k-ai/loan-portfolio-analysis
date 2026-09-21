"use client";

import { useState } from "react";
import { REPORT_REASON_LABELS, ALLOWED_REPORT_REASONS } from "@/lib/validation";
import type { ReportReason } from "@/types/biodata";

export default function ReportForm({ biodataId }: { biodataId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) {
      setError("Please select a reason.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ biodataId, reason }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (status === "success") {
    return (
      <p className="mt-8 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">
        Thank you. This report has been submitted.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 text-sm font-medium text-gray-500 underline hover:text-gray-700"
      >
        Report this biodata
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 flex flex-col gap-3 rounded-md border border-gray-200 p-4"
    >
      <p className="text-sm font-semibold text-gray-900">Report this biodata</p>

      <div className="flex flex-col gap-2">
        {ALLOWED_REPORT_REASONS.map((value) => (
          <label key={value} className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="reason"
              value={value}
              checked={reason === value}
              onChange={() => setReason(value)}
            />
            {REPORT_REASON_LABELS[value]}
          </label>
        ))}
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit Report"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
