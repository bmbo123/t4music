"use client";

import NavBar from "@/components/ui/NavBar";
import Sidebar from "@/components/ui/Sidebar";
import { useState, useEffect, useCallback, useRef } from "react";
import { Song } from "../../../types";
import { FiPlayCircle, FiPauseCircle, FiSearch } from "react-icons/fi";
import { useUserStore } from "@/store/useUserStore";
import PlayBar from "@/components/ui/playBar";
import { getPlaybackURL } from "@/app/api/misc/actions";
import { useSearchParams } from "next/navigation";

const ListenerHome = () => {
  const { username } = useUserStore();
  const searchParams = useSearchParams();
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchQuery(search);
      handleSearch(search);
    }
  }, [searchParams]);

  useEffect(() => {
    setHasMounted(true);
    const fetchData = async () => {
      try {
        const response = await fetch("/api/songs");
        if (!response.ok) {
          throw new Error("Failed to fetch songs");
        }
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

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/songs/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Search failed");
      }
      const data = await response.json();
      setSearchResults(data.songs);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  const updateProgress = useCallback(() => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  }, []);

  const audioPlayer = useCallback(
    async (song: Song) => {
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.addEventListener("timeupdate", updateProgress);
      }

      if (currentSong?.song_id === song.song_id) {
        if (audioRef.current.paused) {
          audioRef.current.play().then(() => setIsPlaying(true));
        } else {
          audioRef.current.pause();
          setIsPlaying(false);
        }
        return;
      }

      audioRef.current.pause();

      const urlResult = await getPlaybackURL(song.file_path);
      if ("failure" in urlResult) {
        console.error("Failed to get playback URL:", urlResult.failure);
        return;
      }

      audioRef.current.src = urlResult.success.url;
      audioRef.current.currentTime = 0;
      setCurrentSong(song);
      setIsPlaying(true);
      setProgress(0);
      audioRef.current
        .play()
        .catch((error) => console.error("Playback failed:", error));
    },
    [currentSong, updateProgress]
  );

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!audioRef.current || !currentSong) return;

      const ProgressBar = e.currentTarget;
      const clickPosition =
        e.clientX - ProgressBar.getBoundingClientRect().left;
      const progressBarWidth = ProgressBar.clientWidth;
      const seekPercentage = (clickPosition / progressBarWidth) * 100;
      const seekTime = (audioRef.current.duration * seekPercentage) / 100;

      audioRef.current.currentTime = seekTime;
      setProgress(seekPercentage);
    },
    [currentSong]
  );

  const SongGallerySection = useCallback(
    ({ title, items }: { title: string; items: Song[] }) => {
      return (
        <section className="w-full max-w-7xl">
          <h2 className="text-xl font-bold text-white mt-8 mb-3">{title}</h2>
          <div className="grid grid-cols-5 gap-4">
            {items.map((song) => {
              const album_art = song.album?.album_art || "";
              const isSongCurrentlyPlaying =
                currentSong?.song_id === song.song_id && isPlaying;

              return (
                <div
                  key={song.song_id}
                  className="group relative rounded-lg overflow-hidden shadow-md no-flicker"
                  style={{
                    backgroundImage: `url(${album_art})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "60%",
                    paddingTop: "60%",
                    willChange: "transform, opacity",
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audioPlayer(song);
                      }}
                      className="text-5xl text-white transition-transform duration-100 hover:scale-105 ease-out will-change-transform"
                    >
                      {isSongCurrentlyPlaying ? (
                        <FiPauseCircle />
                      ) : (
                        <FiPlayCircle />
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-0 w-full bg-black bg-opacity-50 px-2 py-1">
                    <h3 className="text-white text-sm font-semibold truncate">
                      {song.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      );
    },
    [currentSong, isPlaying, audioPlayer]
  );

  if (!hasMounted) return null;

  if (loading) {
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
              <SongGallerySection
                title="Recently Added"
                items={songs.slice(0, 5)}
              />
              <SongGallerySection
                title="Popular Songs"
                items={songs.slice(0, 5)}
              />
              <SongGallerySection
                title="Your Library"
                items={songs.slice(0, 5)}
              />
              <SongGallerySection
                title="Recommended For You"
                items={songs.slice(0, 5)}
              />
            </>
          )}
        </main>
      </div>
      <PlayBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        progress={progress}
        onPlayPause={() => currentSong && audioPlayer(currentSong)}
        onSeek={handleSeek}
      />
    </div>
  );
};

export default ListenerHome;
