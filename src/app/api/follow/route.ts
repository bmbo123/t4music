import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { followerId, followedId } = await req.json();

    if (!followerId || !followedId || followerId === followedId) {
      return NextResponse.json({ error: "Invalid follow request" }, { status: 400 });
    }

    const existing = await prisma.follows.findFirst({
      where: {
        user_id_a: followerId,
        user_id_b: followedId,
      },
    });

    if (existing) {
      // Unfollow
      await prisma.follows.delete({
        where: { follow_id: existing.follow_id },
      });
      return NextResponse.json({ success: true, following: false });
    } else {
      // Follow
      await prisma.follows.create({
        data: {
          user_id_a: followerId,
          user_id_b: followedId,
        },
      });
      return NextResponse.json({ success: true, following: true });
    }
  } catch (error) {
    console.error("❌ Follow error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
