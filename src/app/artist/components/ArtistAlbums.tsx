"use client";
import Link from "next/link";
import Image from "next/image";

interface Album {
  album_id: number;
  title: string;
  album_art?: string;
}

export default function ArtistAlbums({ albums }: { albums: Album[] }) {
  if (!albums || !Array.isArray(albums)) {
    return <div>No albums available</div>; // Return a fallback UI
  }
  return (
    <div className="mt-6 w-full max-w-4xl">
      <h3 className="text-3xl font-semibold mb-5">Albums by Artist</h3>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {albums.map((album) => (
          <Link key={album.album_id} href={`/albums/${album.album_id}`}>
            <div className="min-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
              <Image
                src={album.album_art?.startsWith("http") ? album.album_art : album.album_art ? `/${album.album_art}` : "/albumArt/defaultAlbumArt.png"}
                alt={album.title}
                width={180}
                height={160}
                className="h-40 w-full object-cover rounded-t-xl"
              />
              <p className="text-center py-3 font-semibold">{album.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
