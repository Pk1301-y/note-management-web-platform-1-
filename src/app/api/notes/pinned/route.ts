import { NextResponse } from "next/server";
import { db } from "@/db";
import { notes, categories } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const pinnedNotes = await db
      .select({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        isPinned: notes.isPinned,
        tags: notes.tags,
        categoryId: notes.categoryId,
        categoryName: categories.name,
        categoryColor: categories.color,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
      })
      .from(notes)
      .leftJoin(categories, eq(notes.categoryId, categories.id))
      .where(and(eq(notes.userId, user.id), eq(notes.isPinned, true)))
      .orderBy(desc(notes.updatedAt));

    return NextResponse.json({ notes: pinnedNotes });
  } catch (error) {
    console.error("Get pinned notes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
