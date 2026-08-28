"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import NoteCard from "@/components/NoteCard";

interface Note {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  tags: string;
  categoryName: string | null;
  categoryColor: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
}

function NotesContent() {
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("categoryId") || ""
  );
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (selectedCategory) params.set("categoryId", selectedCategory);
    if (selectedTag) params.set("tag", selectedTag);

    try {
      const res = await fetch(`/api/notes?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedTag]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(console.error);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const handleTogglePin = async (id: number) => {
    const res = await fetch(`/api/notes/${id}/pin`, { method: "PATCH" });
    if (res.ok) {
      const data = await res.json();
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isPinned: data.note.isPinned } : n
        )
      );
    }
  };

  // Collect all unique tags
  const allTags = Array.from(
    new Set(
      notes
        .flatMap((n) => n.tags.split(",").map((t) => t.trim()))
        .filter(Boolean)
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">All Notes</h1>
          <p className="text-slate-500 mt-1">
            {notes.length} note{notes.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Link
          href="/notes/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          ✏️ New Note
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900"
          />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              !selectedCategory
                ? "bg-indigo-100 text-indigo-700"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === String(cat.id) ? "" : String(cat.id)
                )
              }
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                selectedCategory === String(cat.id)
                  ? "text-white"
                  : "text-slate-600 hover:opacity-80"
              }`}
              style={{
                backgroundColor:
                  selectedCategory === String(cat.id)
                    ? cat.color
                    : cat.color + "20",
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-500 py-1">Tags:</span>
            {allTags.slice(0, 10).map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setSelectedTag(selectedTag === tag ? "" : tag)
                }
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedTag === tag
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl">📝</span>
          <h2 className="text-xl font-semibold text-slate-900 mt-4">
            No notes found
          </h2>
          <p className="text-slate-500 mt-2">
            {search || selectedCategory || selectedTag
              ? "Try adjusting your search or filters"
              : "Create your first note to get started"}
          </p>
          {!search && !selectedCategory && !selectedTag && (
            <Link
              href="/notes/create"
              className="inline-block mt-4 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all"
            >
              ✏️ Create Note
            </Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDelete}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AllNotesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      }
    >
      <NotesContent />
    </Suspense>
  );
}
