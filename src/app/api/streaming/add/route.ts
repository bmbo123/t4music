import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function POST(req: NextRequest) {
  try {
    const { songId, artistId } = await req.json();

    const userId = Number(req.cookies.get("user_id")?.value); // ✅ Fixed here

    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    await prisma.streaming_history.create({
      data: {
        listener_id: userId,
        user_id: artistId,
        song_id: songId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to record stream:", err);
    return NextResponse.json({ error: "Failed to record stream" }, { status: 500 });
  }
}
