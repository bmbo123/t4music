import { prisma } from "@/lib/prisma"; 
import { NextResponse } from "next/server";
export async function POST(req: Request) {
    const { followerId, followedId } = await req.json();
  
    await prisma.follows.deleteMany({
      where: {
        user_id_a: followerId,
        user_id_b: followedId,
      },
    });
  
    return NextResponse.json({ message: "Unfollowed" });
  }
  