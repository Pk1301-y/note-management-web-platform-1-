import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notes, categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

// GET a single note
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const noteId = parseInt(id);

    const result = await db
      .select({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        isPinned: notes.isPinned,
        tags: notes.tags,
        categoryId: notes.categoryId,
        categoryName: categories.name,
        categoryColor: categories.color,
        userId: notes.userId,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
      })
      .from(notes)
      .leftJoin(categories, eq(notes.categoryId, categories.id))
      .where(and(eq(notes.id, noteId), eq(notes.userId, user.id)))
      .limit(1);

    const note = result[0];

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Get note error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update a note
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const noteId = parseInt(id);
    const { title, content, categoryId, tags } = await request.json();

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Check note exists and belongs to user
    const existing = await db
      .select({ id: notes.id })
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, user.id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await db
      .update(notes)
      .set({
        title: title.trim(),
        content: content || "",
        categoryId: categoryId || null,
        tags: tags || "",
        updatedAt: new Date(),
      })
      .where(and(eq(notes.id, noteId), eq(notes.userId, user.id)));

    // Fetch updated note
    const [updated] = await db
      .select()
      .from(notes)
      .where(eq(notes.id, noteId))
      .limit(1);

    return NextResponse.json({ note: updated });
  } catch (error) {
    console.error("Update note error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE a note
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const noteId = parseInt(id);

    // Check note exists and belongs to user
    const existing = await db
      .select({ id: notes.id })
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, user.id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await db
      .delete(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete note error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
