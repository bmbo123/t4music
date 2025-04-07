"use client";

import { createContext, useContext, useRef, useState, useCallback } from "react";
import { Song } from "@/types";
import { getPlaybackURL } from "@/app/api/misc/actions";
import { useUserStore } from "@/store/useUserStore";

type AudioContextType = {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  handleSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null); // audioRef will be null initially
  const store = useUserStore();

  const updateProgress = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const playSong = useCallback(async (song: Song) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener("timeupdate", updateProgress);
    }

    const urlResult = await getPlaybackURL(song.file_path);
    if ("failure" in urlResult) {
      console.error("Failed to get playback URL:", urlResult.failure);
      return;
    }

    if (currentSong?.song_id === song.song_id) {
      togglePlayPause(); // If the same song is clicked, toggle play/pause
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = urlResult.success.url;
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setIsPlaying(true);
      setCurrentSong(song);
      setProgress(0);
    }

    // Log streaming
    await fetch("/api/streaming/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: store.userId,
        songId: song.song_id,
        artistId: song.user_id,
      }),
    });

    const res = await fetch("/api/user/me", { cache: "no-store" });
    const updated = await res.json();
    store.setStreamingHistory(updated.streamingHistory);
    store.setTopTracks(updated.topTracks);
  }, [currentSong]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !currentSong) return;
    const bar = e.currentTarget;
    const percent = (e.clientX - bar.getBoundingClientRect().left) / bar.clientWidth;
    if (audioRef.current) {
      audioRef.current.currentTime = percent * audioRef.current.duration;
      setProgress(percent * 100);
    }
  };

  return (
    <AudioContext.Provider
      value={{ currentSong, isPlaying, progress, playSong, togglePlayPause, audioRef, handleSeek }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export const useAudioPlayer = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudioPlayer must be used inside AudioProvider");
  return context;
};
