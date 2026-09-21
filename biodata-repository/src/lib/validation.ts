import type { Gender, ReportReason } from "@/types/biodata";

export const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB
export const MIN_AGE = 18;
export const MAX_AGE = 70;
export const ALLOWED_GENDERS: Gender[] = ["male", "female"];
export const ALLOWED_REPORT_REASONS: ReportReason[] = [
  "spam",
  "inappropriate_content",
  "privacy_concern",
  "other",
];

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  spam: "Spam",
  inappropriate_content: "Inappropriate content",
  privacy_concern: "Privacy concern",
  other: "Other",
};

export function isValidGender(value: unknown): value is Gender {
  return typeof value === "string" && ALLOWED_GENDERS.includes(value as Gender);
}

export function isValidAge(value: unknown): value is number {
  const num = typeof value === "string" ? Number(value) : value;
  return (
    typeof num === "number" &&
    Number.isInteger(num) &&
    num >= MIN_AGE &&
    num <= MAX_AGE
  );
}

export function isValidReportReason(value: unknown): value is ReportReason {
  return (
    typeof value === "string" &&
    ALLOWED_REPORT_REASONS.includes(value as ReportReason)
  );
}

export function isPdfFile(file: File): boolean {
  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}
