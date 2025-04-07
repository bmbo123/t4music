import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function POST(req: Request) {
  try {
    const { user_id, name, playlist_art } = await req.json();

    if (!user_id || !name) {
      return NextResponse.json(
        { error: "Missing user_id or name" },
        { status: 400 }
      );
    }

    const newPlaylist = await prisma.playlists.create({
      data: {
        name,
        user_id,
        created_id: user_id,
        playlist_art: playlist_art || null,
      },
    });

    return NextResponse.json(newPlaylist, { status: 201 });
  } catch (error) {
    console.error("Playlist creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
