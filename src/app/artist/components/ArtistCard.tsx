"use client";
import { useState } from "react";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";

type Artist = {
  user_id: number;
  username: string;
  pfp?: string;
  followers?: number;
  isFollowing?: boolean;
  songs?: { song_id: number }[];
  playlists?: { playlist_id: number }[];
};

export default function ArtistCard({ artist }: { artist: Artist }) {
  const { user_id } = useUserStore();
  const [isFollowing, setIsFollowing] = useState(artist.isFollowing || false);
  const [followers, setFollowers] = useState(artist.followers || 0);

  const handleFollow = async () => {
    const res = await fetch(`/api/follow/${artist.user_id}`, {
      method: "POST",
      body: JSON.stringify({ user_id }),
    });
    const data = await res.json();

    if (data.following) {
      setIsFollowing(true);
      setFollowers((prev) => prev + 1);
    } else {
      setIsFollowing(false);
      setFollowers((prev) => prev - 1);
    }
  };

  return (
    <div className="relative w-full h-80 overflow-hidden bg-black">
      <Image
        src="/artist-banner.jpg"
        alt="Artist Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        width={1920}
        height={1080}
        priority
      />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-black" />
      <div className="relative z-10 flex items-end h-full px-8 pb-6">
        <div className="flex items-center gap-6">
          <Image
            src={artist?.pfp || "/artist-default.jpg"}
            alt={artist?.username}
            className="w-32 h-32 rounded-full object-cover border-4 border-black shadow-xl"
            width={128}
            height={128}
          />
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold text-white">@{artist?.username}</h1>
            <p className="text-gray-300 mt-1">{followers.toLocaleString()} followers</p>

            <div className="flex items-center gap-6 mt-2 text-sm text-gray-300">
              <span>{artist.songs?.length || 0} Tracks</span>
              <span>{artist.playlists?.length || 0} Playlists</span>
              <button
                onClick={handleFollow}
                className="ml-4 px-4 py-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full text-white font-semibold shadow hover:opacity-90 transition"
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
