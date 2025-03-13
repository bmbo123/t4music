"use client";
import Link from "next/link";

export default function ArtistAlbums() {
  // Static album data for now; in the future, replace with dynamic backend data.
  const artistAlbums = [
    { id: "debut-album", name: "Debut Album", img: "/artist-placeholder.jpg" },
    { id: "summer-jams", name: "Summer Jams", img: "/artist-placeholder.jpg" },
    { id: "new-horizons", name: "New Horizons", img: "/artist-placeholder.jpg" },
  ];

  return (
    <div className="mt-6 w-full max-w-4xl">
      <h3 className="text-3xl font-semibold mb-5">Albums by Artist</h3>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {artistAlbums.map((album) => (
          // TODO: Update the URL pattern when integrating the backend.
          <Link key={album.id} href={`/albums/${album.id}`}>
            <div className="min-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
              <img
                src={album.img}
                alt={album.name}
                className="h-40 w-full object-cover rounded-t-xl"
              />
              <p className="text-center py-3 font-semibold">{album.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
