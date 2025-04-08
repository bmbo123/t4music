"use client";

import Image from "next/image";
import { usePlayerStore, useUserStore } from "@/store/useUserStore";
import { FiPlayCircle, FiPauseCircle } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function PlayBar() {
  const { currentSong, isPlaying, togglePlay, progress } = usePlayerStore();
  const { isLoggedIn, likedSongs, toggleLike, username } = useUserStore();

  if (!isLoggedIn || !currentSong) return null;

  const isLiked = likedSongs.some((s) => s.song_id === currentSong.song_id);

  const handleLike = async () => {
    toggleLike(currentSong);
    try {
      await fetch("/api/likes/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, songId: currentSong.song_id }),
      });
    } catch (err) {
      console.error("Failed to update like:", err);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 border-t border-gray-700/50 p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {currentSong.album?.album_art && (
          <Image
            src={currentSong.album.album_art}
            alt={currentSong.album.title || "Album Art"}
            width={64}
            height={64}
            className="w-16 h-16 rounded-md object-cover"
            unoptimized
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate">{currentSong.title}</h3>
          <p className="text-gray-400 text-sm truncate">
            {currentSong.users?.username || "Unknown Artist"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="text-3xl text-white">
            {isPlaying ? <FiPauseCircle /> : <FiPlayCircle />}
          </button>
          <button
            onClick={handleLike}
            className="text-xl hover:scale-110 transition-transform"
            title={isLiked ? "Unlike" : "Like"}
          >
            {isLiked ? (
              <FaHeart className="text-pink-500" />
            ) : (
              <FaRegHeart className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="max-w-7xl mx-auto mt-2 cursor-pointer">
        <div className="h-1 bg-gray-700 rounded-full w-full">
          <div
            className="h-full bg-gradient-to-r from-pink-300 via-blue-400 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}