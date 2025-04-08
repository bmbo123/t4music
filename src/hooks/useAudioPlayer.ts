"use client";

import { useState, useRef, useCallback } from "react";
import { getPlaybackURL } from "@/app/api/misc/actions";
import { useUserStore } from "@/store/useUserStore";
import { Song } from "@/types";

export function useAudioPlayer() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const updateProgress = useCallback(() => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  }, []);

  const playSong = useCallback(async (song: Song) => {
    console.log("Setting current song:", song); // trying to debug play issue/playbar issue

    setCurrentSong(song);  // setting song

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
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    audioRef.current.src = urlResult.success.url;
    audioRef.current.currentTime = 0;
    setProgress(0);

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Audio playback failed:", err);
      setIsPlaying(false);
    }

    await fetch("/api/streaming/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: useUserStore.getState().user_id,
        songId: song.song_id,
        artistId: song.user_id,
      }),
    });

    const updatedRes = await fetch("/api/user/me", { cache: "no-store" });
    const updatedData = await updatedRes.json();
    const store = useUserStore.getState();
    store.setStreamingHistory(updatedData.streamingHistory);
    store.setTopTracks(updatedData.topTracks);
  }, [currentSong, updateProgress]);

  return {
    currentSong,
    isPlaying,
    progress,
    playSong,
    audioRef,
  };
}
