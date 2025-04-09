"use client";

import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import { useAudioPlayer } from "@/context/AudioContext";
import { Song } from "@/types";

export default function TopTracks() {
  const { topTracks } = useUserStore();
  // const { currentSong, isPlaying, playSong, pauseSong } = useAudioPlayer();
  const { currentSong, isPlaying, playSong, togglePlayPause, audioRef } = useAudioPlayer();

  if (!topTracks || topTracks.length === 0) {
    return (
      <p className="text-gray-400 italic">
        No top tracks yet! Start listening to music! ✩°｡⋆⸜ 🎧✮
      </p>
    );
  }

  const handlePlayClick = (track: Song) => {
    if (currentSong?.song_id === track.song_id && isPlaying) {
      togglePlayPause();
    } else {
      playSong(track);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, duration: number) => {
    if (!audioRef.current) return;
    const bar = e.currentTarget;
    const percent = (e.clientX - bar.getBoundingClientRect().left) / bar.clientWidth;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
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
                  src={track.album?.album_art || "/defaultAlbumArt.png"}
                  alt={track.title}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4
                  className="text-white font-semibold cursor-pointer hover:underline"
                  onClick={() => handlePlayClick(track)}
                >
                  {track.title}
                </h4>
                <p className="text-gray-400 text-sm">
                  {track.users?.username || "Unknown artist"}
                </p>
              </div>
            </div>

            {/* Right: rank */}
            <div className="flex items-center gap-2">
              {isCurrent && currentSong?.duration && (
                <div
                  className="w-24 h-2 bg-gray-600 rounded cursor-pointer"
                  onClick={(e) => handleSeek(e, currentSong.duration)}
                >
                  <div
                    className="h-2 bg-white rounded"
                    style={{
                      width: `${(audioRef.current?.currentTime || 0) / currentSong.duration * 100}%`,
                    }}
                  ></div>
                </div>
              )}
              <span className="text-gray-300 text-sm font-mono">#{i + 1}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
