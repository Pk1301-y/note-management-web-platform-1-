"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  noteCount: number;
  createdAt: string;
}

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
];

const ICONS = [
  "📁",
  "📚",
  "🎓",
  "🔬",
  "💻",
  "🎨",
  "📐",
  "🧪",
  "📊",
  "🌍",
  "💡",
  "🎵",
  "📷",
  "🏥",
  "📝",
  "⚡",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    color: COLORS[0],
    icon: ICONS[0],
  });
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm({ name: "", color: COLORS[0], icon: ICONS[0] });
    setShowForm(false);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      const url = editingId
        ? `/api/categories/${editingId}`
        : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save category");
        return;
      }

      resetForm();
      fetchCategories();
    } catch {
      setError("Something went wrong.");
    }
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, color: cat.color, icon: cat.icon });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Delete this category? Notes in this category will become uncategorized."
      )
    )
      return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) fetchCategories();
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">📂 Categories</h1>
          <p className="text-slate-500 mt-1">
            Organize your notes into categories
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 cursor-pointer"
        >
          {showForm ? "✕ Cancel" : "➕ New Category"}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {editingId ? "Edit Category" : "Create Category"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900"
                placeholder="e.g., Mathematics, Computer Science"
              />
            </div>

            {/* Icon picker */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setForm({ ...form, icon })}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                      form.icon === icon
                        ? "bg-indigo-100 ring-2 ring-indigo-500 scale-110"
                        : "bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm({ ...form, color })}
                    className={`w-10 h-10 rounded-xl transition-all cursor-pointer ${
                      form.color === color
                        ? "ring-2 ring-offset-2 ring-indigo-500 scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-2">Preview:</p>
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium"
                style={{ backgroundColor: form.color }}
              >
                <span className="text-lg">{form.icon}</span>
                {form.name || "Category Name"}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all cursor-pointer"
              >
                {editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl">📂</span>
          <h2 className="text-xl font-semibold text-slate-900 mt-4">
            No categories yet
          </h2>
          <p className="text-slate-500 mt-2">
            Create your first category to start organizing notes
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: cat.color + "20" }}
                  >
                    {cat.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{cat.name}</h3>
                    <p className="text-sm text-slate-500">
                      {cat.noteCount} note{cat.noteCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <Link
                  href={`/notes?categoryId=${cat.id}`}
                  className="flex-1 text-center py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  View Notes
                </Link>
                <button
                  onClick={() => handleEdit(cat)}
                  className="px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="px-3 py-2 text-sm text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
