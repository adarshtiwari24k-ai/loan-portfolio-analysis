"use client";

import { useRouter, useSearchParams } from "next/navigation";

const AGE_RANGES = [
  { value: "all", label: "All" },
  { value: "18-25", label: "18–25" },
  { value: "26-30", label: "26–30" },
  { value: "31-35", label: "31–35" },
  { value: "36+", label: "36+" },
];

export default function BiodataFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const gender = searchParams.get("gender") ?? "all";
  const ageRange = searchParams.get("age") ?? "all";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/biodatas${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="gender-filter" className="mb-1 block text-sm font-semibold text-gray-900">
          Gender
        </label>
        <select
          id="gender-filter"
          value={gender}
          onChange={(e) => updateParam("gender", e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-base"
        >
          <option value="all">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div className="flex-1">
        <label htmlFor="age-filter" className="mb-1 block text-sm font-semibold text-gray-900">
          Age
        </label>
        <select
          id="age-filter"
          value={ageRange}
          onChange={(e) => updateParam("age", e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-base"
        >
          {AGE_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
