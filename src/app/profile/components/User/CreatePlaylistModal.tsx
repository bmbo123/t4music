"use client";

import { useState } from "react";

export default function CreatePlaylistModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, playlist_art: string) => void;
}) {
  const [name, setName] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return alert("Playlist name is required.");
    onCreate(name, coverUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-80 backdrop-blur-md">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-xl animate-fadeIn space-y-6">
        <h2 className="text-2xl font-extrabold text-white text-center">Create New Playlist</h2>

        <input
          type="text"
          placeholder="Playlist Name"
          className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Cover Art URL (optional)"
          className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
        />

        <div className="flex justify-end gap-4 pt-2">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 hover:bg-pink-600 text-black font-bold px-5 py-2 rounded-xl shadow transition-transform hover:scale-105"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
