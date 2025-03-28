"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaHeart, FaListUl, FaMusic, FaChevronLeft } from "react-icons/fa";

interface Sidebaruser{
    username?:string;
}
export default function Sidebar({ username }: Sidebaruser) {
    const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`bg-black text-white h-full transition-all duration-300 ${isOpen ? "w-64" : "w-16"} flex flex-col`}>
      <div className="flex items-center justify-between p-4">
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          {isOpen ? <FaChevronLeft /> : <FaBars />}
        </button>
        {isOpen && (
  <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient drop-shadow-lg">
    Hi, {username}
  </h1>
)}
      </div>

      <nav className="flex flex-col space-y-2 px-4">
      <Link href="/listener/liked-songs"
      className="flex items-center gap-3 hover:text-pink-400">
          <FaHeart />
          {isOpen && <span>Liked Songs</span>}
        </Link>
        <Link href="/listener/my-playlists"
        className="flex items-center gap-3 hover:text-blue-400">
          <FaListUl />
          {isOpen && <span>My Playlists</span>}
        </Link>
        <Link href="/home" className="flex items-center gap-3 hover:text-purple-400">
          <FaMusic />
          {isOpen && <span>Browse Music</span>}
        </Link>
      </nav>
    </div>
  );
}
