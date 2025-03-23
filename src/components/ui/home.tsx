"use client";
import { useState } from "react";
import { Song, Album } from "../../../types";
import { FiPlayCircle } from "react-icons/fi";

interface ListenerHomeProps {
  username: string;
}

const ListenerHome = ({ username }: ListenerHomeProps) => {
  const [albums] = useState<Album[]>([
    {
      Album_id: 1,
      album_art: '/song-placeholder.jpg',
      title: 'Global Warming',
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
  ]);

  const [songs] = useState<Song[]>([
    {
      song_id: 1,
      title: 'Hotel Room Service',
      Album_id: 1,
      genre: 'Pop',
      duration: 180,
      file_path: '/music/HotelRoomService.mp3',
      file_format: 'mp3',
      uploaded_at: new Date(),
      plays_count: 1,
      user_id: 1,
    },
    // additional songs...
  ]);

  const playSong = (file_path: string) => {
    const audio = new Audio(file_path);
    audio.play();
  };

  const SongGallerySection = ({ title, items }: { title: string; items: Song[] }) => (
    <section className="w-full max-w-7xl">
      <h2 className="text-xl font-bold text-white mt-8 mb-3">{title}</h2>
      <div className="grid grid-cols-5 gap-4">
        {items.map((song) => {
          const album = albums.find((album) => album.Album_id === song.Album_id);
          const album_art = album?.album_art || '';

          return (
            <div
              key={song.song_id}
              className="group relative rounded-lg overflow-hidden shadow-md"
              style={{
                backgroundImage: `url(${album_art})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '60%',
                paddingTop: '60%',
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => playSong(song.file_path)}
                  className="text-5xl text-white"
                >
                  <FiPlayCircle />
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

  return (
    <div className="flex flex-col items justify-start min-h-screen bg-black p-6 overflow-auto">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-300 via-purple-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
        Hello, {username}
      </h1>

      <SongGallerySection title="Continue Where You Left Off" items={songs.slice(0, 3)} />
      <SongGallerySection title="Recently Played Songs" items={songs.slice(0, 3)} />
      <SongGallerySection title="Recently Played Albums" items={songs.slice(0, 3)} />
      <SongGallerySection title="Recommended For You" items={songs.slice(0, 3)} />
    </div>
  );
};

export default ListenerHome;
