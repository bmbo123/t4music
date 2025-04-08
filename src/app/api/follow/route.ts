import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { followerId, followedId } = await req.json();

  //we have to prevent dup follows so we do ID
  const existing = await prisma.follows.findFirst({
    where: {
      user_id_a: followerId,
      user_id_b: followedId,
    },
  });

  if (existing) {
    return NextResponse.json({ message: "Already following" }, { status: 409 });
  }

  const follow = await prisma.follows.create({
    data: {
      user_id_a: followerId,
      user_id_b: followedId,
    },
  });

  return NextResponse.json(follow, { status: 200 });
}