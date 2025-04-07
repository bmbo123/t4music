"use client";

import { useEffect, useState } from "react";
import NavBar from '@/components/ui/NavBar';
import ArtistCard from '../components/Artist/ArtistCard';
import ArtistAlbums from '../components/Artist/ArtistAlbums';
import TopTracks from '../components/Artist/TopTracks';
import ArtistBio from '../components/Artist/ArtistBio';
import ReportsButton from '../components/ReportsButton';
import ProfileSettingsButton from '../components/ProfileSettingsButton';
import DeleteAccountButton from '../components/DeleteAccountButton';
import { useUserStore } from "@/store/useUserStore";

export default function ArtistProfilePage() {
  const { user_id } = useUserStore();
  const [albumCount, setAlbumCount] = useState(0);
  const [songCount, setSongCount] = useState(0);

  useEffect(() => {
    if (!user_id) return;

    const fetchCounts = async () => {
      const [albumsRes, songsRes] = await Promise.all([
        fetch(`/api/albums/user/${user_id}`),
        fetch(`/api/songs/artist/${user_id}`),
      ]);

      const albums = await albumsRes.json();
      const songs = await songsRes.json();

      setAlbumCount(albums.length || 0);
      setSongCount(songs.length || 0);
    };

    fetchCounts();
  }, [user_id]);

  return (
    <div className="min-h-screen bg-black text-white overflow-visible">
      <NavBar role="artist" />
      <ArtistCard albumCount={albumCount} songCount={songCount} />
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        <ArtistBio />
        <ArtistAlbums />
        <TopTracks />
        <div className="flex flex-wrap gap-6 justify-center mt-8">
          <ReportsButton />
          <ProfileSettingsButton />
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
