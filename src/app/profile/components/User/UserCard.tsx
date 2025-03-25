"use client";
import Image from "next/image";

interface UserCardProps {
  username: string | null;
}

export default function UserCard({ username }: UserCardProps) {
  return (
    <div className="relative w-full bg-black p-8">
      <div className="flex items-center gap-6 mt-8">
        <Image
          src="/ed.jpeg"
          alt="User Avatar"
          width={120}
          height={120}
          className="rounded-full object-cover border-4 border-black shadow-md"
          priority
        />
        <div className="flex flex-col">
          <span className="text-white text-sm uppercase tracking-wide mb-1">
            Profile
          </span>
          <h2 className="text-5xl font-extrabold text-white leading-none">
            {username || "User"}
          </h2>
          <p className="text-white text-sm mt-2">
            16 Public Playlists • 2 Followers • 2 Following
          </p>
        </div>
      </div>
    </div>
  );
}
