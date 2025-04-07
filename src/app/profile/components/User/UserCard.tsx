"use client";

import { useUserStore } from "@/store/useUserStore";
import ChangeProfilePic from "@/components/ui/changepfp";
import { useEffect } from "react";

export default function UserCard() {
  const { username, pfp, followers, following, playlistCount, user_id, setPfp } = useUserStore();

  useEffect(() => {
    const loadUserData = async () => {
      const response = await fetch(`/api/user/${user_id}`);
      const userData = await response.json();
      setPfp(userData.pfp);
    };
    loadUserData();
  }, [user_id, setPfp]);

  return (
    <div className="relative w-full bg-black px-10 py-12 rounded-b-xl shadow-md border-b border-gray-800">
      <div className="flex items-center gap-8">
        {/* profile avatar */}
        <ChangeProfilePic
          currentPfp={pfp || "/default_pfp.jpg"}
          userId={user_id}
          onUploadComplete={(url) => setPfp(url)}
          />

        <div className="flex flex-col gap-2">
          <span className="text-white text-sm uppercase tracking-wider">Profile</span>

          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-500 to-blue-500 animate-gradient drop-shadow-md">
            {username || "User"}
          </h1>

          {/* stats */}
          <p className="text-white mt-1 text-sm sm:text-base">
            {playlistCount} Public Playlists • {followers} Followers • {following} Following
          </p>
        </div>
      </div>
    </div>
  );
}
