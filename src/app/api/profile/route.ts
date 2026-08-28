import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, notes, categories } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET profile with stats
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const profileResult = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
        bio: users.bio,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    const profile = profileResult[0];

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

    return NextResponse.json({
      user: profile,
      stats: {
        totalNotes: Number(noteStats?.total) || 0,
        pinnedNotes: Number(noteStats?.pinned) || 0,
        totalCategories: Number(categoryCount?.total) || 0,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update profile
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { name, bio, currentPassword, newPassword } = await request.json();

    const updateData: { name?: string; bio?: string; passwordHash?: string } =
      {};

    if (name) updateData.name = name.trim();
    if (bio !== undefined) updateData.bio = bio;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password" },
          { status: 400 }
        );
      }

      const currentUserResult = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

      const currentUser = currentUserResult[0];

      const isValid = await bcrypt.compare(
        currentPassword,
        currentUser.passwordHash
      );
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      updateData.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    // Fetch updated user
    const [updated] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        bio: users.bio,
        avatar: users.avatar,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
