"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/ui/NavBar";
import Sidebar from "@/components/ui/Sidebar";
import { FiPlayCircle, FiPauseCircle, FiSearch } from "react-icons/fi";
import { useUserStore } from "@/store/useUserStore";
import { useRouter, useSearchParams } from "next/navigation";
import { Song } from "../../../types";
import { useAudioPlayer } from "@/context/AudioContext";
import PlayBar from "@/components/ui/playBar";

const ListenerHome = () => {
  const router = useRouter();
  const { username, toggleLike, likedSongs, playlists } = useUserStore();
  const searchParams = useSearchParams();

  const [songs, setSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    song: Song | null;
  } | null>(null);

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);

  const {
    currentSong,
    isPlaying,
    playSong,
    progress,
    handleSeek,
  } = useAudioPlayer();

  useEffect(() => {
    async function fetchUserData() {
      const res = await fetch("/api/user/profile", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const store = useUserStore.getState();
      store.setUser(data.username, data.role, data.pfp, data.user_id);
      store.setLikedSongs(data.likedSongs);
      store.setPlaylists(data.playlists);
      store.setStreamingHistory(data.streamingHistory);
      store.setTopTracks(data.topTracks);
      store.setFollowers(data.followers);
      store.setFollowing(data.following);
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    setHasMounted(true);
    const fetchData = async () => {
      try {
        const response = await fetch("/api/songs");
        if (!response.ok) throw new Error("Failed to fetch songs");
        const data: Song[] = await response.json();
        setSongs(data);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchQuery(search);
      handleSearch(search);
    }
  }, [searchParams]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/songs/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setSearchResults(data.songs);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const SongGallerySection = ({ title, items }: { title: string; items: Song[] }) => (
    <section className="w-full max-w-7xl">
      <h2 className="text-xl font-bold text-white mt-8 mb-3">{title}</h2>
      <div className="grid grid-cols-5 gap-4">
        {items.map((song) => {
          const album_art = song.album?.album_art || "";
          const isSongCurrentlyPlaying = currentSong?.song_id === song.song_id && isPlaying;

          return (
            <div
              key={song.song_id}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({ x: e.clientX, y: e.clientY, song });
              }}
              onClick={() => playSong(song)}
              className="group relative rounded-lg overflow-hidden shadow-md no-flicker"
              style={{
                backgroundImage: `url(${album_art})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "60%",
                paddingTop: "60%",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playSong(song);
                  }}
                  className="text-5xl text-white transition-transform duration-100 hover:scale-105"
                >
                  {isSongCurrentlyPlaying ? <FiPauseCircle /> : <FiPlayCircle />}
                </button>
              </div>
              <div className="absolute bottom-0 w-full bg-black bg-opacity-50 px-2 py-1">
                <h3 className="text-white text-sm font-semibold truncate">{song.title}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  if (!hasMounted || loading) {
    return (
      <div className="flex min-h-screen bg-black text-white items-center justify-center">
        <div className="text-xl">Loading songs...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar username={username} />
      <div className="flex flex-col flex-1 min-w-0">
        <NavBar role="listener" />
        <main className="p-6 overflow-auto">
          <div className="relative mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search songs, artists, or genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {isSearching ? (
            <div className="text-center py-8">Searching...</div>
          ) : searchQuery && searchResults.length > 0 ? (
            <SongGallerySection title="Search Results" items={searchResults} />
          ) : searchQuery && !isSearching ? (
            <div className="text-center py-8">No results found</div>
          ) : (
            <>
              <SongGallerySection title="Recently Added" items={songs.slice(0, 5)} />
              <SongGallerySection title="Popular Songs" items={songs.slice(0, 5)} />
              <SongGallerySection title="Your Library" items={songs.slice(0, 5)} />
              <SongGallerySection title="Recommended For You" items={songs.slice(0, 5)} />
            </>
          )}
        </main>
      </div>

      {contextMenu && (
        <div
          className="fixed bg-gray-800 text-white rounded shadow-lg z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={() => setContextMenu(null)}
        >
          <ul>
            <li
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={async () => {
                const song = contextMenu.song!;
                toggleLike(song);
                try {
                  await fetch("/api/likes/toggle", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, songId: song.song_id }),
                  });
                } catch (err) {
                  console.error("Failed to sync like to DB:", err);
                }
                setContextMenu(null);
              }}
            >
              💗 {likedSongs.some((s) => s.song_id === contextMenu.song?.song_id)
                ? "Remove from your Liked Songs"
                : "Save to your Liked Songs"}
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                setSelectedSongForPlaylist(contextMenu.song);
                setShowPlaylistModal(true);
                setContextMenu(null);
              }}
            >
              ➕ Add to Playlist
            </li>
          </ul>
        </div>
      )}

      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-96 space-y-4">
            <h2 className="text-white text-lg font-bold">Add to Playlist</h2>
            {playlists.map((playlist) => (
              <div
                key={playlist.playlist_id}
                className="text-white hover:bg-gray-700 p-2 rounded cursor-pointer"
                onClick={() => {
                  fetch("/api/playlist/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      song_id: selectedSongForPlaylist?.song_id,
                      playlist_id: playlist.playlist_id,
                    }),
                  }).then(() => setShowPlaylistModal(false));
                }}
              >
                {playlist.name}
              </div>
            ))}
            <button
              className="w-full mt-2 py-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded text-white font-medium"
              onClick={() => router.push("/listener/my-playlists?create=true")}
            >
              + Create New Playlist
            </button>
          </div>
        </div>
      )}

      {/* PlayBar (global player) */}
      <PlayBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        progress={progress}
        onPlayPause={() => currentSong && playSong(currentSong)}
        onSeek={handleSeek}
      />
    </div>
  );
};

export default ListenerHome;