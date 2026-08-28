import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notes, categories } from "@/db/schema";
import { eq, and, desc, sql, like } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

// GET all notes for the current user
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const tag = searchParams.get("tag");
    const search = searchParams.get("q");

    const conditions = [eq(notes.userId, user.id)];

    if (categoryId) {
      conditions.push(eq(notes.categoryId, parseInt(categoryId)));
    }

    if (tag) {
      conditions.push(like(notes.tags, "%" + tag + "%"));
    }

    if (search) {
      conditions.push(
        sql`(${notes.title} LIKE ${"%" + search + "%"} OR ${notes.content} LIKE ${"%" + search + "%"})`
      );
    }

    const userNotes = await db
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
      .where(and(...conditions))
      .orderBy(desc(notes.isPinned), desc(notes.updatedAt));

    return NextResponse.json({ notes: userNotes });
  } catch (error) {
    console.error("Get notes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create a new note
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { title, content, categoryId, tags } = await request.json();

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const result = await db.insert(notes).values({
      title: title.trim(),
      content: content || "",
      userId: user.id,
      categoryId: categoryId || null,
      tags: tags || "",
    });

    const insertId = result[0].insertId;

    const [newNote] = await db
      .select()
      .from(notes)
      .where(eq(notes.id, Number(insertId)))
      .limit(1);

    return NextResponse.json({ note: newNote }, { status: 201 });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
