import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Biodata Repository
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Upload. Search. View Biodatas.
      </p>

      <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
        <Link
          href="/biodatas"
          className="w-full rounded-md bg-gray-900 px-6 py-4 text-base font-semibold text-white hover:bg-gray-700 sm:w-auto"
        >
          Browse Biodatas
        </Link>
        <Link
          href="/upload"
          className="w-full rounded-md border border-gray-300 px-6 py-4 text-base font-semibold text-gray-900 hover:bg-gray-50 sm:w-auto"
        >
          Upload Biodata
        </Link>
      </div>

      <p className="mt-12 max-w-md text-sm text-gray-500">
        A simple, public place to publish and browse matrimonial biodatas as
        PDF files. No accounts, no matchmaking, no chat — just upload, search
        and view.
      </p>
    </div>
  );
}
