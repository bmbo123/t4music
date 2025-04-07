"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { createPlaylist } from "@/app/actions/createPlaylist";
import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import CreatePlaylistModal from "./CreatePlaylistModal";

type Playlist = {
  playlist_id: number;
  name: string;
  playlist_art?: string;
};

export default function UserPlaylists() {
  const { username, isLoggedIn, user_id } = useUserStore();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchPlaylists() {
      const res = await fetch(`/api/playlists/user/${username}`);
      const data = await res.json();
      setPlaylists(data);
    }

    if (isLoggedIn) fetchPlaylists();
  }, [username, isLoggedIn]);

  const handleCreatePlaylist = async (name: string, playlist_art: string) => {
    const newPlaylist = await createPlaylist(name, user_id, playlist_art);
    setPlaylists([...playlists, newPlaylist]);
    }
  };

  const handleDelete = async (playlistId: number) => {
    const confirm = window.confirm("Are you sure you want to delete this playlist?");
    if (!confirm) return;

    const res = await fetch(`/api/playlists/${playlistId}/delete`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || "Failed to delete playlist");

    alert("🗑️ Playlist deleted!");
    setPlaylists(playlists.filter((p) => p.playlist_id !== playlistId));
  };

  return (
    <div className="mt-10 w-full max-w-4xl">
      <h3 className="text-3xl font-semibold mb-5">My Playlists</h3>

      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {playlists.map((playlist) => (
          <div
            key={playlist.playlist_id}
            className="relative group min-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center py-4"
          >
            {/* 🗑️ Delete Button (top right) */}
            <button
              onClick={() => handleDelete(playlist.playlist_id)}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              title="Delete playlist"
            >
              <FaTrashAlt size={14} />
            </button>

            {/* Playlist card with link */}
            <Link href={`/playlists/${playlist.playlist_id}`} className="flex flex-col items-center">
              <div className="h-36 w-36 bg-gray-800 rounded-xl overflow-hidden">
                <Image
                  src={playlist.playlist_art || "/albumArt/defaultAlbumArt.png"}
                  alt={playlist.name}
                  width={144}
                  height={144}
                  className="rounded-xl object-cover"
                />
              </div>
              <p className="text-center py-3 font-semibold">{playlist.name}</p>
            </Link>
          </div>
        ))}

        {/* ➕ Add Button */}
        <button onClick={() => setShowModal(true)}>
          <div className="min-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col items-center justify-center py-4">
            <div className="h-36 w-36 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-400 animate-gradient rounded-xl flex items-center justify-center">
              <FaPlus size={48} className="text-white" />
            </div>
            <p className="text-center py-3 font-semibold">Add Playlist</p>
          </div>
        </button>
      </div>

      {showModal && (
        <CreatePlaylistModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreatePlaylist}
        />
      )}
    </div>
  );
}
