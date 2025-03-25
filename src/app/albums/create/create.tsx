"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function CreateAlbum() {
  const [title, setTitle] = useState("");
  const [albumArt, setAlbumArt] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Pass the logged in user's id.
    const { user_id } = useUserStore();

    const res = await fetch("/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, album_art: albumArt || "/default-album-art.jpg", user_id }),
    });

    if (res.ok) {
      const album = await res.json();
      // Redirect to the new album's page where the user can add songs.
      router.push(`/albums/${album.Album_id}`);
    } else {
      console.error("Failed to create album");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Create a New Album</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          placeholder="Album Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded mb-4 bg-gray-800 text-white"
          required
        />
        <input
          type="text"
          placeholder="Album Art URL (optional)"
          value={albumArt}
          onChange={(e) => setAlbumArt(e.target.value)}
          className="w-full p-2 rounded mb-4 bg-gray-800 text-white"
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-500 p-2 rounded font-bold"
        >
          Create Album
        </button>
      </form>
    </div>
  );
}
