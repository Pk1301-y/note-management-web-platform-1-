"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Stats {
  totalNotes: number;
  pinnedNotes: number;
  totalCategories: number;
}

interface RecentNote {
  id: number;
  title: string;
  isPinned: boolean;
  tags: string;
  updatedAt: string;
}

interface RecentCategory {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalNotes: 0,
    pinnedNotes: 0,
    totalCategories: 0,
  });
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);
  const [recentCategories, setRecentCategories] = useState<RecentCategory[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, meRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/auth/me"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
          setRecentNotes(statsData.recentNotes);
          setRecentCategories(statsData.recentCategories);
        }

        if (meRes.ok) {
          const meData = await meRes.json();
          setUserName(meData.user.name);
        } else if (meRes.status === 401) {
          router.push("/login");
          return;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {userName.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Here&apos;s an overview of your notes and activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          href="/notes"
          className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl group-hover:scale-110 transition-transform">
              📝
            </span>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
              View All
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.totalNotes}</p>
          <p className="text-sm text-slate-500 mt-1">Total Notes</p>
        </Link>

        <Link
          href="/pinned"
          className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl group-hover:scale-110 transition-transform">
              📌
            </span>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              View All
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {stats.pinnedNotes}
          </p>
          <p className="text-sm text-slate-500 mt-1">Pinned Notes</p>
        </Link>

        <Link
          href="/categories"
          className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl group-hover:scale-110 transition-transform">
              📂
            </span>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              View All
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {stats.totalCategories}
          </p>
          <p className="text-sm text-slate-500 mt-1">Categories</p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-2">Quick Actions</h2>
        <p className="text-indigo-100 mb-6">
          Jump right into creating or organizing your notes.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/notes/create"
            className="px-5 py-2.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
          >
            ✏️ New Note
          </Link>
          <Link
            href="/categories"
            className="px-5 py-2.5 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors"
          >
            📂 Manage Categories
          </Link>
          <Link
            href="/notes"
            className="px-5 py-2.5 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors"
          >
            🔍 Browse Notes
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Notes */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Notes
            </h2>
            <Link
              href="/notes"
              className="text-sm text-indigo-600 hover:underline"
            >
              See all →
            </Link>
          </div>
          {recentNotes.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl">📝</span>
              <p className="text-slate-500 mt-3">No notes yet</p>
              <Link
                href="/notes/create"
                className="text-sm text-indigo-600 hover:underline mt-1 inline-block"
              >
                Create your first note →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <span className="text-lg">{note.isPinned ? "📌" : "📄"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {note.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Categories</h2>
            <Link
              href="/categories"
              className="text-sm text-indigo-600 hover:underline"
            >
              See all →
            </Link>
          </div>
          {recentCategories.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl">📂</span>
              <p className="text-slate-500 mt-3">No categories yet</p>
              <Link
                href="/categories"
                className="text-sm text-indigo-600 hover:underline mt-1 inline-block"
              >
                Create your first category →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/notes?categoryId=${cat.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: cat.color + "20" }}
                  >
                    {cat.icon}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{cat.name}</p>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
