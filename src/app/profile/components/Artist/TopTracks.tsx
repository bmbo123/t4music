"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useUserStore, usePlayerStore } from "@/store/useUserStore";


interface Song {
  song_id: number;
  title: string;
  file_path: string;
  duration: number;
  plays_count: number;
  album?: {
    album_art?: string;
  };
}

export default function TopTracks() {
  const { user_id, username, isLoggedIn } = useUserStore();
  const { setSong } = usePlayerStore();
  const [tracks, setTracks] = useState<Song[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newSong, setNewSong] = useState({ title: "", genre: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await fetch(`/api/songs/artist/${user_id}`);
      const data = await res.json();
      setTracks(data || []);
    };
    if (user_id) fetchSongs();
  }, [user_id]);

  const handlePlay = (song: Song) => {
    setSong({
      ...song,
      users: { username },
      album: song.album || {
        title: "Single",
        album_art: "/albumArt/defaultAlbumArt.png",
      },
    });
  };

  const handleDelete = async (song_id: number) => {
    const confirmDelete = confirm("Delete this song?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/songs/${song_id}`, { method: "DELETE" });
    const result = await res.json();

    if (!res.ok) return alert(result.error);
    setTracks((prev) => prev.filter((s) => s.song_id !== song_id));
  };

  const handleUpload = async () => {
    if (!newSong.title || !selectedFile || !username) return alert("Missing fields");

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("username", username);
      formData.append("title", newSong.title);
      formData.append("genre", newSong.genre);

      const res = await fetch("/api/songs/upload-single", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTracks((prev) => [...prev, data.song]);
      setShowModal(false);
      setNewSong({ title: "", genre: "" });
      setSelectedFile(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || "Upload failed");
      } else {
        alert("Upload failed");
      }
    }
     finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 w-full max-w-4xl">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-3xl font-semibold">Top Tracks</h3>
        {isLoggedIn && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            ➕ Upload Song
          </button>
        )}
      </div>

      <ul className="space-y-4">
        {tracks.map((track) => (
          <li
            key={track.song_id}
            className="bg-gray-900 py-3 px-5 rounded-xl shadow-lg flex items-center justify-between hover:bg-gray-800 transition"
          >
            <div className="flex items-center gap-4">
              <Image
                src={track.album?.album_art || "/albumArt/defaultAlbumArt.png"}
                alt={track.title}
                width={48}
                height={48}
                className="object-cover rounded-md"
              />
              <div>
                <p className="text-white font-medium">{track.title}</p>
                <p className="text-gray-400 text-sm">{track.plays_count} plays</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handlePlay(track)}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded text-white"
              >
                ▶ Play
              </button>
              {isLoggedIn && (
                <button
                  onClick={() => handleDelete(track.song_id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-white"
                >
                  ❌
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow max-w-md w-full space-y-4">
            <h3 className="text-xl font-semibold text-white">Upload New Song</h3>
            <input
              type="text"
              placeholder="Song Title"
              className="w-full bg-gray-800 text-white p-2 rounded"
              value={newSong.title}
              onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Genre"
              className="w-full bg-gray-800 text-white p-2 rounded"
              value={newSong.genre}
              onChange={(e) => setNewSong({ ...newSong, genre: e.target.value })}
            />
            <input
              type="file"
              accept="audio/*"
              className="w-full bg-gray-800 text-white p-2 rounded"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                {submitting ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
