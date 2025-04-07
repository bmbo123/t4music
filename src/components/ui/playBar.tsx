"use client";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Song } from "@/types";
import { useUserStore } from "@/store/useUserStore";
import { FiPlayCircle, FiPauseCircle } from "react-icons/fi"; // Import cute icons for play and pause

interface PlayBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const PlayBar = ({ currentSong, isPlaying, progress, onPlayPause, onSeek }: PlayBarProps) => {
  const { likedSongs, toggleLike, username } = useUserStore();

  if (!currentSong) return null;

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
        {currentSong?.album?.album_art && (
<<<<<<< HEAD
          <img
=======
          <Image
>>>>>>> parent of d342f95 (YESSSSSSSSSSSSSSSSSSSS IT WORKED)
            src={currentSong.album.album_art}
            className="w-16 h-16 rounded-md"
            alt={currentSong.album.title}
            width={64}
            height={64}
<<<<<<< HEAD
=======
            unoptimized
>>>>>>> parent of d342f95 (YESSSSSSSSSSSSSSSSSSSS IT WORKED)
          />
        )}

        <div className="flex-1 min-w-0">
<<<<<<< HEAD
          <h3 className="text-white font-medium truncate">{currentSong?.title}</h3>
          <p className="text-gray-400 text-sm truncate">{currentSong?.users?.username || "Unknown artist"}</p>
=======
          <h3 className="text-white font-medium truncate">{currentSong.title}</h3>
          <p className="text-gray-400 text-sm truncate">
            {currentSong.users?.username || "Unknown artist"}
          </p>
>>>>>>> parent of d342f95 (YESSSSSSSSSSSSSSSSSSSS IT WORKED)
        </div>

        <div className="flex items-center gap-4">
<<<<<<< HEAD
          <button onClick={onPlayPause} className="text-3xl text-white">
            {isPlaying ? (
              <FiPauseCircle className="text-white" />
=======
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
>>>>>>> parent of d342f95 (YESSSSSSSSSSSSSSSSSSSS IT WORKED)
            ) : (
              <FiPlayCircle className="text-white" />
            )}
          </button>

          <button onClick={handleLike} className="text-xl hover:scale-110 transition-transform">
            {isLiked ? <FaHeart className="text-pink-500" /> : <FaRegHeart className="text-white" />}
          </button>
        </div>
      </div>

<<<<<<< HEAD
      <div className="max-w-7xl mx-auto mt-2 cursor-pointer" onClick={onSeek}>
=======
      <div className="max-w-7xl mx-auto mt-2 cursor-pointer">
>>>>>>> parent of d342f95 (YESSSSSSSSSSSSSSSSSSSS IT WORKED)
        <div className="h-1 bg-gray-700 rounded-full w-full">
          <div
            className="h-full bg-gradient-to-r from-pink-300 via-blue-400 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayBar;
