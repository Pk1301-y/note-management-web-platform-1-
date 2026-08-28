import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
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

    // Get current note
    const result = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, user.id)))
      .limit(1);

    const note = result[0];

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await db
      .update(notes)
      .set({ isPinned: !note.isPinned, updatedAt: new Date() })
      .where(and(eq(notes.id, noteId), eq(notes.userId, user.id)));

    // Fetch updated note
    const [updated] = await db
      .select()
      .from(notes)
      .where(eq(notes.id, noteId))
      .limit(1);

    return NextResponse.json({ note: updated });
  } catch (error) {
    console.error("Toggle pin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
