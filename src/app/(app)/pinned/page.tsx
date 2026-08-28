"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

export default function PinnedNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPinned = async () => {
    try {
      const res = await fetch("/api/notes/pinned");
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPinned();
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
      // Remove from pinned list since it's now unpinned
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">📌 Pinned Notes</h1>
        <p className="text-slate-500 mt-1">
          Your most important notes, always at hand
        </p>
      </div>

      {/* Notes */}
      {notes.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl">📌</span>
          <h2 className="text-xl font-semibold text-slate-900 mt-4">
            No pinned notes
          </h2>
          <p className="text-slate-500 mt-2">
            Pin your important notes to keep them easily accessible
          </p>
          <Link
            href="/notes"
            className="inline-block mt-4 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all"
          >
            Browse Notes →
          </Link>
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
