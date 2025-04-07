"use client";
import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore"; // Make sure the path is correct

// Define the expected structure of each followed artist
type FollowedArtist = {
  user_id: number;
  username: string;
  pfp?: string;
};

export default function ArtistsFollowing() {
  const { followedArtists } = useUserStore();

  if (!followedArtists || followedArtists.length === 0) {
    return (
      <div className="mt-10 w-full max-w-4xl">
        <h3 className="text-2xl font-semibold mb-5">Artists Following</h3>
        <p className="text-gray-400 italic">Oops! You are not following any artists yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-10 w-full max-w-4xl">
      <h3 className="text-3xl font-semibold mb-5">Artists Following</h3>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {followedArtists.map((artist: FollowedArtist) => (
          <Link key={artist.user_id} href={`/artist/${artist.user_id}`}>
            <div className="text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
              <Image
                src={artist.pfp || "/artist-default.jpg"}
                alt={artist.username}
                width={112}
                height={112}
                className="w-28 h-28 rounded-full shadow-xl object-cover"
              />
              <p className="mt-2 font-medium">{artist.username}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
