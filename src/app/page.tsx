import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-3xl">📓</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            NoteVault
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6">
        <section className="text-center py-20 md:py-32">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
            <span>✨</span> Your thoughts, beautifully organized
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Capture Ideas.
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Organize Knowledge.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            NoteVault is the ultimate note-taking platform for students,
            researchers, and lifelong learners. Create, tag, categorize, and pin
            your most important notes — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:shadow-2xl hover:-translate-y-0.5"
            >
              Start Taking Notes →
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 text-lg font-semibold text-slate-700 bg-white rounded-2xl border-2 border-slate-200 hover:border-indigo-300 transition-all"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            Everything you need to stay organized
          </h2>
          <p className="text-center text-slate-500 mb-16 max-w-xl mx-auto">
            Powerful features designed to help you capture, organize, and
            retrieve your notes effortlessly.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📝",
                title: "Rich Note Taking",
                desc: "Create detailed notes with titles, content, and organize them with tags and categories.",
              },
              {
                icon: "🔍",
                title: "Powerful Search",
                desc: "Find any note instantly with full-text search across titles, content, and tags.",
              },
              {
                icon: "📌",
                title: "Pin Important Notes",
                desc: "Keep your most critical notes at the top with the pin feature for quick access.",
              },
              {
                icon: "📂",
                title: "Categories & Tags",
                desc: "Organize notes into custom categories with colors and add multiple tags for easy filtering.",
              },
              {
                icon: "🎨",
                title: "Beautiful Interface",
                desc: "A clean, modern design that makes note-taking a pleasure, not a chore.",
              },
              {
                icon: "🔒",
                title: "Secure & Private",
                desc: "Your notes are protected with secure authentication. Only you can access your data.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-8 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-20 mb-10">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to organize your thoughts?
            </h2>
            <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of students and professionals who use NoteVault to
              stay organized and productive.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 text-lg font-semibold text-indigo-600 bg-white rounded-2xl hover:bg-indigo-50 transition-all shadow-xl"
            >
              Create Free Account →
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-400">
          © 2026 NoteVault. Built with Next.js & MySQL.
        </div>
      </footer>
    </div>
  );
}
