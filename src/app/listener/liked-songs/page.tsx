"use client";

import NavBar from "@/components/ui/NavBar";
import Sidebar from "@/components/ui/Sidebar";
import { useUserStore } from "@/store/useUserStore";

export default function LikedSongsPage() {
  const { likedSongs, username, role } = useUserStore();

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar username={username} />

      <div className="flex flex-col flex-1 min-w-0">
        <NavBar role={(role || "listener") as "listener" | "artist" | "admin"} />

        <main className="p-6 overflow-auto">
          <div className="bg-gradient-to-br from-pink-500 via-blue-400 to-purple-600 p-6 rounded-lg shadow-md mb-8">
            <h1 className="text-4xl font-bold">Liked Songs</h1>
            <p className="mt-2 text-lg text-white/70">
              {username} • {likedSongs.length} songs
            </p>
          </div>

          <div className="p-6">
            <ul className="space-y-4">
              {likedSongs.map((song, index) => (
                <li
                  key={song.song_id}
                  className="flex items-center justify-between border-b border-gray-700 pb-2"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 w-6 text-right">{index + 1}</span>
                    <div>
                      <p className="font-semibold text-white">{song.title}</p>
                      <p className="text-sm text-gray-400">{song.genre}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">
                    {song.liked_at
                      ? new Date(song.liked_at).toLocaleDateString()
                      : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
