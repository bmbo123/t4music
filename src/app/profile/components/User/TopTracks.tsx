"use client";
import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";

export default function TopTracks() {
  const { topTracks } = useUserStore();

  if (!topTracks || topTracks.length === 0) {
    return (
      <p className="text-gray-400 italic">
        No top tracks yet! Start listening to music! ✩°｡⋆⸜ 🎧✮
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {topTracks.map((track, i) => (
        <li
          key={track.song_id}
          className="flex justify-between items-center bg-gradient-to-l from-pink-800 via-blue-800 to-purple-800 animate-gradient rounded-lg px-4 py-3 shadow-md"
        >
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
              <h4 className="text-white font-semibold">{track.title}</h4>
              <p className="text-gray-400 text-sm">{track.users?.username || "Unknown artist"}</p>
            </div>
          </div>
          <span className="text-gray-400">#{i + 1}</span>
        </li>
      ))}
    </ul>
  );
}
