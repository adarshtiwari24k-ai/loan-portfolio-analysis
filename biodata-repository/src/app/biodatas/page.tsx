import { Suspense } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Biodata, Gender } from "@/types/biodata";
import BiodataCard from "@/components/BiodataCard";
import BiodataFilters from "@/components/BiodataFilters";

export const dynamic = "force-dynamic";

const AGE_RANGE_BOUNDS: Record<string, [number, number | null]> = {
  "18-25": [18, 25],
  "26-30": [26, 30],
  "31-35": [31, 35],
  "36+": [36, null],
};

async function getBiodatas(gender: string, ageRange: string): Promise<Biodata[]> {
  let query = supabase
    .from("biodatas")
    .select("id, gender, age, file_url, created_at")
    .order("created_at", { ascending: false });

  if (gender === "male" || gender === "female") {
    query = query.eq("gender", gender satisfies Gender);
  }

  const bounds = AGE_RANGE_BOUNDS[ageRange];
  if (bounds) {
    const [min, max] = bounds;
    query = query.gte("age", min);
    if (max !== null) {
      query = query.lte("age", max);
    }
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

export default async function BrowsePage({
  searchParams,
}: PageProps<"/biodatas">) {
  const params = await searchParams;
  const gender = typeof params.gender === "string" ? params.gender : "all";
  const ageRange = typeof params.age === "string" ? params.age : "all";

  const biodatas = await getBiodatas(gender, ageRange);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Browse Biodatas</h1>

      <div className="mt-6">
        <Suspense fallback={null}>
          <BiodataFilters />
        </Suspense>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {biodatas.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            No biodatas match these filters yet.
          </p>
        ) : (
          biodatas.map((biodata) => (
            <BiodataCard key={biodata.id} biodata={biodata} />
          ))
        )}
      </div>
    </div>
  );
}
