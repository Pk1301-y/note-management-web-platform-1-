import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl border border-slate-100 shadow-xl p-8">
        <span className="text-6xl">🔍</span>
        <h1 className="text-4xl font-bold text-slate-900 mt-4 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-700 mb-3">
          Page Not Found
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
          >
            Go to Landing
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-indigo-200"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
