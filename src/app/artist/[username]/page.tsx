"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/ui/NavBar";
import ArtistCard from "../components/ArtistCard";
import ArtistAlbums from "../components/ArtistAlbums";
import TopTracks from "../components/TopTracks";
import ArtistBio from "../components/ArtistBio";
import { useUserStore } from "@/store/useUserStore";
import type { Artist } from "../components/ArtistCard";
import type { Song } from "@/types"; // Import the Song type

export default function ArtistPage() {
  const { username } = useParams<{ username: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const { user_id } = useUserStore();

  useEffect(() => {
    const fetchArtist = async () => {
      const res = await fetch(`/api/artists/${username}?viewer=${user_id}`);
      const data = await res.json();

      const updatedSongs = data.songs.map((song: Song) => ({
        ...song,
        duration: song.duration || 0,
      }));

      setArtist({ ...data, songs: updatedSongs as Song[] });
    };

    if (username && user_id !== -1) fetchArtist();
  }, [username, user_id]);

  if (!artist) return <div className="text-white p-6">Loading artist profile...</div>;

  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar />
      <ArtistCard artist={artist} />
      <div className="relative max-w-6xl mx-auto px-6 pb-10 space-y-12 mt-8">
        <ArtistAlbums albums={artist.album} />
        {/* Pass the songs array as Song[] */}
        <TopTracks tracks={artist.songs as Song[]} />
        <ArtistBio />
      </div>
    </div>
  );
}
