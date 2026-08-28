import { NextResponse } from "next/server";
import { db } from "@/db";
import { notes, categories } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const noteStatsResult = await db
      .select({
        total: sql<number>`cast(count(*) as unsigned)`,
        pinned: sql<number>`cast(sum(case when ${notes.isPinned} = true then 1 else 0 end) as unsigned)`,
      })
      .from(notes)
      .where(eq(notes.userId, user.id));

    const noteStats = noteStatsResult[0];

    const categoryCountResult = await db
      .select({ total: sql<number>`cast(count(*) as unsigned)` })
      .from(categories)
      .where(eq(categories.userId, user.id));

    const categoryCount = categoryCountResult[0];

    const recentNotes = await db
      .select({
        id: notes.id,
        title: notes.title,
        isPinned: notes.isPinned,
        tags: notes.tags,
        updatedAt: notes.updatedAt,
      })
      .from(notes)
      .where(eq(notes.userId, user.id))
      .orderBy(desc(notes.updatedAt))
      .limit(5);

    const recentCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        color: categories.color,
        icon: categories.icon,
      })
      .from(categories)
      .where(eq(categories.userId, user.id))
      .orderBy(desc(categories.createdAt))
      .limit(5);

    return NextResponse.json({
      stats: {
        totalNotes: Number(noteStats?.total) || 0,
        pinnedNotes: Number(noteStats?.pinned) || 0,
        totalCategories: Number(categoryCount?.total) || 0,
      },
      recentNotes,
      recentCategories,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
