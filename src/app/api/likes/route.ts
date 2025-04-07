import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function POST(req: Request) {
  try {
    const { userId, songId } = await req.json();

    if (!userId || !songId) {
      return NextResponse.json({ error: "Missing userId or songId" }, { status: 400 });
    }

    await prisma.$executeRawUnsafe(`
      INSERT INTO likes (listener_id, song_id, liked_at)
      VALUES (${userId}, ${songId}, NOW())
    `);

    return NextResponse.json({ message: "Song liked!" });
  } catch (error) {
    console.error("Error liking song:", error);
    return NextResponse.json({ error: "Could not like song" }, { status: 500 });
  }
}
