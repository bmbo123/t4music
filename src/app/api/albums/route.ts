// app/api/albums/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function POST(request: Request) {
  try {
    const { title, album_art, user_id } = await request.json();

    const album = await prisma.album.create({
      data: {
        title,
        album_art,
        user_id,
      },
    });

    return NextResponse.json(album, { status: 201 });
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to create album" }, { status: 500 });
  }
}
