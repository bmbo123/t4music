"use client";

import NavBar from "@/components/ui/NavBar";
import Sidebar from "@/components/ui/Sidebar";
import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import { useAudioPlayer } from "@/context/AudioContext"; // Global audio player hook
import PlayBar from "@/components/ui/playBar"; // Import PlayBar component

export default function MyPlaylistsPage() {
  const { playlists, username } = useUserStore();
  const { currentSong, isPlaying, progress, playSong } = useAudioPlayer(); // Use global audio player state

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar username={username} />

      <div className="flex flex-col flex-1 min-w-0">
        <NavBar />

        <main className="p-6 overflow-auto">
          <div className="bg-gradient-to-br from-pink-500 via-blue-400 to-purple-600 p-6 rounded-lg shadow-md mb-8">
            <h1 className="text-4xl font-bold">Your Playlists</h1>
            <p className="mt-2 text-white/70">
              {username} • {playlists.length} playlists
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.playlist_id}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-all"
              >
                <Image
                  src={playlist.playlist_art || "/song-placeholder.jpg"}
                  alt={playlist.name}
                  width={400}
                  height={400}
                  className="w-full h-48 object-cover rounded-t-md"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold truncate">{playlist.name}</h2>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* PlayBar Component */}
      <PlayBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        progress={progress}
        onPlayPause={() => currentSong && playSong(currentSong)}
        onSeek={(e) => {
          if (!currentSong) return;
          const bar = e.currentTarget;
          const percent = (e.clientX - bar.getBoundingClientRect().left) / bar.clientWidth;
          const currentTime = percent * currentSong.duration; 
          playSong(currentSong); // This will trigger the song change, if needed
        }}
      />
    </div>
  );
}
