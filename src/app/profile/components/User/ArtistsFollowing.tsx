"use client";
import Link from "next/link";

export default function ArtistsFollowing() {
  // TODO: Replace static artist data with dynamic data from the backend in the future.
  const artists = [
    { id: "artist-1", name: "Artist 1", img: "/artist-default.jpg" },
    { id: "artist-2", name: "Artist 2", img: "/artist-default.jpg" },
    { id: "artist-3", name: "Artist 3", img: "/artist-default.jpg" },
  ];

  return (
    <div className="mt-10 w-full max-w-4xl">
      <h3 className="text-3xl font-semibold mb-5">Artists Following</h3>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {artists.map((artist) => (
          // For now, all links point to /artist (the public ArtistPage)
          // TODO: Update to /artist/[artistId] once dynamic routing/backend is implemented.
          <Link key={artist.id} href="/artist">
            <div className="text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
              <img
                src={artist.img}
                alt={artist.name}
                className="w-28 h-28 rounded-full shadow-xl object-cover"
              />
              <p className="mt-2 font-medium">{artist.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
