import Link from "next/link";
import type { Biodata } from "@/types/biodata";

export default function BiodataCard({ biodata }: { biodata: Biodata }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 px-5 py-4">
      <div>
        <p className="text-base font-semibold capitalize text-gray-900">
          {biodata.gender}
        </p>
        <p className="text-sm text-gray-600">Age: {biodata.age}</p>
      </div>
      <Link
        href={`/biodatas/${biodata.id}`}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
      >
        View Biodata
      </Link>
    </div>
  );
}
