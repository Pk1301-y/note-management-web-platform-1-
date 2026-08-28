"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface NoteCardProps {
  note: {
    id: number;
    title: string;
    content: string;
    isPinned: boolean;
    tags: string;
    categoryName?: string | null;
    categoryColor?: string | null;
    createdAt: string;
    updatedAt: string;
  };
  onDelete?: (id: number) => void;
  onTogglePin?: (id: number) => void;
}

export default function NoteCard({
  note,
  onDelete,
  onTogglePin,
}: NoteCardProps) {
  const router = useRouter();
  const tags = note.tags
    ? note.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  const preview = note.content.slice(0, 150);

  const handlePin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTogglePin) onTogglePin(note.id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(note.id);
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        note.isPinned
          ? "border-amber-300 shadow-amber-100 shadow-md"
          : "border-slate-100 hover:border-indigo-200"
      }`}
    >
      <Link href={`/notes/${note.id}`} className="block p-5">
        {/* Pin badge */}
        {note.isPinned && (
          <div className="absolute top-3 right-3 text-amber-500 text-lg">
            📌
          </div>
        )}

        {/* Category */}
        {note.categoryName && (
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mb-3"
            style={{
              backgroundColor: (note.categoryColor || "#6366f1") + "20",
              color: note.categoryColor || "#6366f1",
            }}
          >
            {note.categoryName}
          </span>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 mb-2 pr-8 line-clamp-2">
          {note.title}
        </h3>

        {/* Preview */}
        {preview && (
          <p className="text-sm text-slate-500 mb-3 line-clamp-3">{preview}</p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md text-xs">
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Date */}
        <p className="text-xs text-slate-400">
          Updated {new Date(note.updatedAt).toLocaleDateString()}
        </p>
      </Link>

      {/* Actions */}
      <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handlePin}
          className={`p-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
            note.isPinned
              ? "text-amber-500 hover:bg-amber-50"
              : "text-slate-400 hover:bg-slate-100"
          }`}
          title={note.isPinned ? "Unpin" : "Pin"}
        >
          📌
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/notes/${note.id}/edit`);
          }}
          className="p-1.5 rounded-lg text-sm text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg text-sm text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
