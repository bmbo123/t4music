import { prisma } from "../../../../../prisma/script";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = Number(req.cookies.get("user_id")?.value);

    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const likedSongs = await prisma.$queryRawUnsafe(`
      SELECT 
        s.song_id,
        s.title,
        s.genre,
        s.duration,
        s.file_format,
        s.file_path,
        s.user_id,
        l.liked_at,
        u.username AS artist_username,
        u.pfp AS artist_pfp
      FROM likes l
      JOIN songs s ON l.song_id = s.song_id
      JOIN users u ON s.user_id = u.user_id
      WHERE l.listener_id = ${userId}
    `);

    const playlists = await prisma.$queryRaw`
      SELECT playlist_id, name, playlist_art 
      FROM playlists 
      WHERE user_id = ${userId}
    `;

    const streamingHistory = await prisma.$queryRaw`
      SELECT s.song_id, s.title, s.genre, s.file_path, sh.played_at 
      FROM streaming_history sh 
      JOIN songs s ON sh.song_id = s.song_id 
      WHERE sh.listener_id = ${userId} 
      ORDER BY sh.played_at DESC 
      LIMIT 10
    `;

    const followers = await prisma.follows.findMany({ where: { user_id_b: userId } });
    const following = await prisma.follows.findMany({ where: { user_id_a: userId } });

    const topTracks = await prisma.streaming_history.groupBy({
      by: ["song_id"],
      where: { listener_id: userId },
      _count: true,
      orderBy: { _count: { song_id: "desc" } },
      take: 5,
    });

    const topTrackDetails = await prisma.songs.findMany({
      where: {
        song_id: { in: topTracks.map((t) => t.song_id) },
      },
      include: {
        album: true,
        users: {
          select: {
            username: true,
            user_id: true,
          },
        },
      },
    });

    const topArtists = await prisma.streaming_history.groupBy({
      by: ["user_id"],
      where: { listener_id: userId },
      _count: true,
      orderBy: { _count: { user_id: "desc" } },
      take: 5,
    });

    const topArtistDetails = await prisma.users.findMany({
      where: {
        user_id: {
          in: topArtists.map((a) => a.user_id),
        },
      },
      select: {
        user_id: true,
        username: true,
        pfp: true,
      },
    });

    return NextResponse.json({
      user_id: user.user_id,
      username: user.username,
      role: user.role,
      pfp: user.pfp || "/default-pfp.jpg",
      likedSongs,
      playlists,
      streamingHistory,
      followers,
      following,
      topTracks: topTrackDetails,
      topArtists: topArtistDetails,
    });

  } catch (err) {
    console.error("/api/user/me error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
