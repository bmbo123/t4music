"use client";
import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";

export default function UserAlbums({ isArtist }: { isArtist: boolean }) {
  const userAlbums = [
    { id: "roadtrip-mix", name: "Roadtrip Mix", img: "/artist-placeholder.jpg" },
    { id: "chill-vibes", name: "Chill Vibes", img: "/artist-placeholder.jpg" },
  ];

  // If not an artist, prepend a "Liked Songs" album
  if (!isArtist) {
    userAlbums.unshift({
      id: "liked-songs",
      name: "Liked Songs",
      img: null!, // No image; will use an icon instead
    });
  }

  return (
    <div className="mt-10 w-full max-w-4xl">
      <h3 className="text-3xl font-semibold mb-5">My Albums</h3>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {userAlbums.map((album) => (
          <Link key={album.id} href={`/albums/${album.id}`}>
            <div className="min-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col items-center justify-center py-4">
              <div className="h-36 w-36 flex items-center justify-center bg-gray-800 rounded-xl shadow-inner">
                {album.name === "Liked Songs" ? (
                  <HeartIcon />
                ) : (
                  <Image
                    src={album.img ?? ""}
                    alt={album.name}
                    width={144}
                    height={144}
                    className="rounded-xl object-cover h-full w-full"
                  />
                )}
              </div>
              <p className="text-center py-3 font-semibold">{album.name}</p>
            </div>
          </Link>
        ))}
        {/* Plus card for adding a new album */}
        <Link href="/albums/create">
          <div className="min-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col items-center justify-center py-4">
            <div className="h-36 w-36 flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-500 rounded-xl shadow-inner">
              <FaPlus size={48} className="text-white" />
            </div>
            <p className="text-center py-3 font-semibold">Add Album</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

const HeartIcon = () => (
  <div className="flex justify-center items-center h-full w-full bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-xl">
    <Heart size={48} strokeWidth={2.5} className="text-white" />
  </div>
);
