"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

interface Params {
  albumId?: string; // albumId may be undefined initially
}

export default function AlbumDetail() {
  const [songTitle, setSongTitle] = useState("");
  const router = useRouter();
  const params = useParams() as Params;
  const albumId = params.albumId;

  // Retrieve the authenticated user's id from the store
  const { user_id } = useUserStore();

  // If albumId isn't available yet, return a loading state
  if (!albumId) {
    return <div className="min-h-screen bg-black text-white p-4">Loading album...</div>;
  }

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure user_id is available
    if (!user_id) {
      console.error("User is not authenticated");
      return;
    }

    const res = await fetch(`/api/albums/${albumId}/songs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: songTitle,
        Album_id: parseInt(albumId, 10),
        user_id, // Pass the authenticated user's id
        // Additional song fields (e.g., file_path, genre) can be added here
      }),
    });

    if (res.ok) {
      // Optionally refresh or update UI, or redirect if needed
      setSongTitle("");
    } else {
      const errorData = await res.json();
      console.error("Failed to add song", errorData);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Album Details</h1>
      {/* Album details would be loaded here */}
      <form onSubmit={handleAddSong} className="max-w-md">
        <input
          type="text"
          placeholder="Song Title"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          className="w-full p-2 rounded mb-4 bg-gray-800 text-white"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-bold"
        >
          Add Song
        </button>
      </form>
    </div>
  );
}
