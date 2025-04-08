"use client";

import { useEffect, useState } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import PlayBar from "@/components/ui/playBar";
// import { useUserStore } from "@/store/useUserStore";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);
  // const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const { currentSong, isPlaying, progress, playSong, audioRef } = useAudioPlayer();
  console.log(isPlaying, progress, playSong);// you can delete after use

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <main className="flex-1">{children}</main>

      {hasMounted && currentSong && (
        <>
          <audio ref={audioRef} autoPlay hidden src={audioRef.current?.src} />
          <PlayBar/>
        </>
      )}
    </div>
  );
}
