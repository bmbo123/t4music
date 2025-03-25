"use client";
import Image from "next/image";

interface ArtistCardProps {
  artistName: string | null;
}

export default function ArtistCard({ artistName }: ArtistCardProps) {
  return (
    <div className="relative w-full bg-black">
      <div className="p-8">
        <div className="flex items-center gap-6 mt-8">
          {/* Artist Avatar */}
          <Image
            src="/artist-default.jpg"
            alt="Artist Avatar"
            width={120}
            height={120}
            className="rounded-full object-cover border-4 border-black shadow-md"
            priority
          />

          {/* Artist Info */}
          <div className="flex flex-col">
            <span className="text-white text-sm uppercase tracking-wide mb-1">
              Artist
            </span>
            <h2 className="text-5xl font-extrabold text-white leading-none">
              {artistName || "Artist Name"}
            </h2>
            <p className="text-white text-sm mt-2">
              1.2M Followers • Indie Genre
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Short tagline or bio snippet here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
