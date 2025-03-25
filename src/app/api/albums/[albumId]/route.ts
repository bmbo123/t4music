// app/api/albums/[albumId]/songs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function POST(
  request: Request,
  { params }: { params: { albumId: string } }
) {
  try {
    // Extract user_id from the request body along with other data.
    const { title, Album_id, user_id, ...songData } = await request.json();

    // If user_id is missing, return an error response.
    if (!user_id) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Create the song using the provided user_id
    const song = await prisma.songs.create({
      data: {
        title,
        Album_id,
        duration: 180, // set default or get from songData
        file_path: "/public/music/Hotel-Room-Service.mp3", // placeholder or from songData
        file_format: "mp3",
        user_id, // now using the passed-in user_id
        ...songData,
      },
    });

    // Optionally create a relation in album_songs if needed:
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
