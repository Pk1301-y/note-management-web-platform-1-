"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Note {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  tags: string;
  categoryId: number | null;
  categoryName: string | null;
  categoryColor: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function NoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/notes/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setNote(data.note);
        } else {
          router.push("/notes");
        }
      } catch {
        router.push("/notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    const res = await fetch(`/api/notes/${params.id}`, { method: "DELETE" });
    if (res.ok) router.push("/notes");
  };

  const handleTogglePin = async () => {
    const res = await fetch(`/api/notes/${params.id}/pin`, { method: "PATCH" });
    if (res.ok) {
      const data = await res.json();
      setNote((prev) => (prev ? { ...prev, isPinned: data.note.isPinned } : prev));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!note) return null;

  const tags = note.tags
    ? note.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/notes" className="hover:text-indigo-600">
          Notes
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate">{note.title}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {note.isPinned && (
              <span className="text-amber-500 text-xl">📌</span>
            )}
            <h1 className="text-3xl font-bold text-slate-900">{note.title}</h1>
          </div>
          {note.categoryName && (
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: (note.categoryColor || "#6366f1") + "20",
                color: note.categoryColor || "#6366f1",
              }}
            >
              {note.categoryName}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePin}
            className={`p-2.5 rounded-xl border-2 transition-colors cursor-pointer ${
              note.isPinned
                ? "border-amber-300 bg-amber-50 text-amber-600"
                : "border-slate-200 text-slate-400 hover:border-amber-300 hover:text-amber-500"
            }`}
            title={note.isPinned ? "Unpin" : "Pin"}
          >
            📌
          </button>
          <Link
            href={`/notes/${note.id}/edit`}
            className="p-2.5 rounded-xl border-2 border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            title="Edit"
          >
            ✏️
          </Link>
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-xl border-2 border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-500 transition-colors cursor-pointer"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/notes?tag=${encodeURIComponent(tag)}`}
              className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-slate-400 mb-8 pb-6 border-b border-slate-100">
        <span>
          Created {new Date(note.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span>•</span>
        <span>
          Updated {new Date(note.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-100 p-8">
        {note.content ? (
          <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed">
            {note.content}
          </div>
        ) : (
          <p className="text-slate-400 italic">This note has no content.</p>
        )}
      </div>

      {/* Back */}
      <div className="mt-8">
        <Link
          href="/notes"
          className="text-indigo-600 hover:underline font-medium"
        >
          ← Back to all notes
        </Link>
      </div>
    </div>
  );
}
