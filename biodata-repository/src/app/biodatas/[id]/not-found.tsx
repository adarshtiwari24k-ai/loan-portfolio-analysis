import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-xl font-bold text-gray-900">Biodata not found</h1>
      <p className="mt-2 text-gray-600">
        This biodata may have been removed or the link is incorrect.
      </p>
      <Link
        href="/biodatas"
        className="mt-6 inline-block rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700"
      >
        Browse Biodatas
      </Link>
    </div>
  );
}
