"use client";

import { useEffect, useState } from "react";

type Song = {
  song_id: number;
  title: string;
  genre?: string;
};

export default function AddSongModal({
  onClose,
  onAdd,
  playlistId,
}: {
  onClose: () => void;
  onAdd: (songId: number) => void;
  playlistId: number;
}) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Song[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await fetch("/api/songs");
      const data = await res.json();
      setSongs(data);
      setFiltered(data);
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    const results = songs.filter((s) =>
      s.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
  }, [search, songs]);

  const handleAdd = async (songId: number) => {
    const res = await fetch(`/api/playlists/${playlistId}/add-song`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song_id: songId }),
    });

    const result = await res.json();
    if (!res.ok) return alert(result.error || "Failed to add song");
    alert("🎵 Song added!");
    onAdd(songId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-xl animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-white">Add a Song</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl font-bold"
          >
            ✖
          </button>
        </div>

        <input
          type="text"
          placeholder="Search songs..."
          className="w-full mb-6 px-4 py-2 rounded-xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ul className="space-y-4">
          {filtered.map((song) => (
            <li
              key={song.song_id}
              className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl hover:scale-[1.02] hover:shadow-lg transition-transform duration-300 cursor-pointer"
              onClick={() => handleAdd(song.song_id)}
            >
              <div>
                <p className="font-semibold text-white text-lg">{song.title}</p>
                <p className="text-sm text-gray-400">{song.genre}</p>
              </div>
              <button className="bg-gradient-to-r from-pink-300 via-blue-300 to-purple-300 hover:bg-gradient-to-l from-pink-600 via-blue-600 to-purple-600 text-black font-bold px-4 py-1 rounded-full text-sm shadow">
                Add
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <p className="text-gray-500 text-center mt-6">No songs found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
