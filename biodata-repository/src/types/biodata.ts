export type Gender = "male" | "female";

export interface Biodata {
  id: string;
  gender: Gender;
  age: number;
  file_url: string;
  created_at: string;
}

export type ReportReason =
  | "spam"
  | "inappropriate_content"
  | "privacy_concern"
  | "other";

export interface Report {
  id: string;
  biodata_id: string;
  reason: ReportReason;
  created_at: string;
}
