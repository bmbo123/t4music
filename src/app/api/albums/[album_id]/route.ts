import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const match = url.pathname.match(/\/albums\/(\d+)/);
    const albumId = match ? parseInt(match[1]) : NaN;

    if (isNaN(albumId)) {
      return NextResponse.json({ error: "Invalid album ID" }, { status: 400 });
    }

    const album = await prisma.album.findUnique({
      where: { album_id: albumId },
      include: {
        users: {
          select: { username: true },
        },
        album_songs: {
          include: {
            songs: {
              select: {
                song_id: true,
                title: true,
                duration: true,
                file_path: true,
                file_format: true,
                user_id: true,    
                users: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    const songs = album.album_songs.map((entry) => entry.songs);

    return NextResponse.json({
      album_id: album.album_id,
      title: album.title,
      album_art: album.album_art,
      user_id: album.user_id,
      creator: album.users?.username || "Unknown Artist",
      songs,
    });
  } catch (err) {
    console.error("❌ Album fetch error:", err);
    return NextResponse.json({ error: "Failed to load album" }, { status: 500 });
  }
}
