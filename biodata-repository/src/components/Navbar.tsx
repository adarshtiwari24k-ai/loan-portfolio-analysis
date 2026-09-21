import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-gray-900">
          Biodata Repository
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium sm:gap-6">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            Home
          </Link>
          <Link href="/biodatas" className="text-gray-700 hover:text-gray-900">
            Browse Biodatas
          </Link>
          <Link
            href="/upload"
            className="rounded-md bg-gray-900 px-3 py-2 text-white hover:bg-gray-700"
          >
            Upload
          </Link>
        </div>
      </nav>
    </header>
  );
}
