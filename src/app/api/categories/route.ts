import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories, notes } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

// GET all categories for the current user
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        color: categories.color,
        icon: categories.icon,
        noteCount: sql<number>`cast(count(${notes.id}) as unsigned)`,
        createdAt: categories.createdAt,
      })
      .from(categories)
      .leftJoin(notes, eq(categories.id, notes.categoryId))
      .where(eq(categories.userId, user.id))
      .groupBy(categories.id)
      .orderBy(desc(categories.createdAt));

    return NextResponse.json({ categories: userCategories });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create a new category
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { name, color, icon } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const result = await db.insert(categories).values({
      name: name.trim(),
      color: color || "#6366f1",
      icon: icon || "📁",
      userId: user.id,
    });

    const insertId = result[0].insertId;

    const [newCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, Number(insertId)))
      .limit(1);

    return NextResponse.json({ category: newCategory }, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
