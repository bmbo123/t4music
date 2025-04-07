"use client";
import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import { useAudioPlayer } from "@/context/AudioContext";

export default function TopTracks() {
  const { topTracks } = useUserStore();
  const { currentSong, isPlaying, playSong, pauseSong } = useAudioPlayer();

  if (!topTracks || topTracks.length === 0) {
    return (
      <p className="text-gray-400 italic">
        No top tracks yet! Start listening to music! ✩°｡⋆⸜ 🎧✮
      </p>
    );
  }

  const handlePlayClick = (track: any) => {
    if (currentSong?.song_id === track.song_id && isPlaying) {
      pauseSong();
    } else {
      playSong(track);
    }
  };

  return (
    <ul className="space-y-4">
      {topTracks.map((track, i) => {
        const isCurrent = currentSong?.song_id === track.song_id;

        return (
          <li
            key={track.song_id}
            className={`flex items-center justify-between bg-gradient-to-l from-pink-800 via-blue-800 to-purple-800 animate-gradient rounded-lg px-4 py-3 shadow-md
              ${isCurrent ? "ring-2 ring-white/70" : ""}`}
          >
            {/* Left: album + track info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-700">
                <Image
                  src={track.album?.album_art || "/default-art.jpg"}
                  alt={track.title}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                {/* Track title as clickable play trigger */}
                <h4
                  className="text-white font-semibold cursor-pointer hover:underline"
                  onClick={() => handlePlayClick(track)}
                >
                  {track.title}
                </h4>
                <p className="text-gray-400 text-sm">{track.users?.username || "Unknown artist"}</p>
              </div>
            </div>

            {/* Right: rank */}
            <span className="text-gray-300 text-sm font-mono">#{i + 1}</span>
          </li>
        );
      })}
    </ul>
  );
}
