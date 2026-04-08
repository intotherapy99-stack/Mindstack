import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-neutral-900 mb-2">404</h1>
      <p className="text-neutral-500 mb-6">Page not found</p>
      <Link
        href="/dashboard"
        className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
