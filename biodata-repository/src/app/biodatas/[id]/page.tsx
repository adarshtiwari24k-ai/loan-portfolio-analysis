import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Biodata } from "@/types/biodata";
import ReportForm from "@/components/ReportForm";

export const dynamic = "force-dynamic";

async function getBiodata(id: string): Promise<Biodata | null> {
  const { data, error } = await supabase
    .from("biodatas")
    .select("id, gender, age, file_url, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export default async function ViewBiodataPage({
  params,
}: PageProps<"/biodatas/[id]">) {
  const { id } = await params;
  const biodata = await getBiodata(id);

  if (!biodata) {
    notFound();
  }

  const downloadUrl = `${biodata.file_url}?download=biodata-${biodata.id}.pdf`;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <p className="text-lg font-semibold capitalize text-gray-900">
        {biodata.gender}
      </p>
      <p className="text-gray-600">Age: {biodata.age}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={biodata.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-md bg-gray-900 px-6 py-4 text-center text-base font-semibold text-white hover:bg-gray-700"
        >
          View PDF
        </a>
        <a
          href={downloadUrl}
          className="flex-1 rounded-md border border-gray-300 px-6 py-4 text-center text-base font-semibold text-gray-900 hover:bg-gray-50"
        >
          Download PDF
        </a>
      </div>

      <ReportForm biodataId={biodata.id} />
    </div>
  );
}
