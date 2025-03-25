// app/api/albums/[albumId]/songs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function POST(
  request: Request,
  { params }: { params: { albumId: string } }
) {
  try {
    // Parse the request body
    const { title, Album_id, ...songData } = await request.json();

    // For development only: use a default user id
    const user_id = 1; // This bypasses any API password or authentication

    const song = await prisma.songs.create({
      data: {
        title,
        Album_id,
        duration: 180, // default duration
        file_path: "/public/music/Hotel-Room-Service.mp3", // placeholder file path
        file_format: "mp3",
        user_id, // using the hardcoded user id
        ...songData,
      },
    });

    // Create the album_songs relationship
    await prisma.album_songs.create({
      data: {
        Album_id: parseInt(params.albumId, 10),
        song_id: song.song_id,
      },
    });

    return NextResponse.json(song, { status: 201 });
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to add song" }, { status: 500 });
  }
}
