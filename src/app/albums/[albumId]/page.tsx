"use client";

export default function AlbumPage() {
  // TODO: Replace this static album data with real backend logic when available.
  const albumData = {
    title: "My Album",
    cover: "/artist-banner.jpg", // Ensure this image is in your /public folder
    tracks: [
      { id: "1", title: "Track One", duration: "3:30" },
      { id: "2", title: "Track Two", duration: "4:00" },
    ],
  };

  const handlePlayAlbum = () => {
    // TODO: Integrate with an audio player or music service in the future.
    alert("Playing album...");
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Container (Hero section) */}
      <div className="p-8">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Album Cover */}
          <img
            src={albumData.cover}
            alt="Album Cover"
            className="w-[200px] h-[200px] object-cover rounded-md shadow-lg"
          />

          <div className="flex flex-col justify-end">
            <h1 className="text-3xl sm:text-5xl font-bold mb-2 leading-tight">
              {albumData.title}
            </h1>

            {/* Play Album Button */}
            <button
              onClick={handlePlayAlbum}
              className="mt-6 bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-2 rounded-full transition-transform transform hover:scale-105 w-fit"
            >
              Play
            </button>
          </div>
        </div>
      </div>

      {/* Tracklist Section */}
      <div className="px-8 pb-16 max-w-6xl mx-auto">
        {/* Table Header */}
        <div className="grid grid-cols-[auto_1fr_auto] text-gray-400 px-4 py-2 border-b border-gray-700">
          <span className="justify-self-center">#</span>
          <span>Title</span>
          <span className="justify-self-end">Duration</span>
        </div>

        {/* Table Rows */}
        {albumData.tracks.map((track, index) => (
          <div
            key={track.id}
            className="grid grid-cols-[auto_1fr_auto] items-center px-4 py-3 border-b border-gray-800 hover:bg-gray-800 transition"
          >
            {/* Track Number */}
            <span className="justify-self-center text-gray-400 text-sm">
              {index + 1}
            </span>

            {/* Track Title */}
            <span className="font-medium">{track.title}</span>

            {/* Track Duration */}
            <span className="justify-self-end text-gray-400 text-sm">
              {track.duration}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
