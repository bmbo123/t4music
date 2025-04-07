"use client";

import NavBar from "@/components/ui/NavBar";
import Sidebar from "@/components/ui/Sidebar";
import { useUserStore } from "@/store/useUserStore";
import { useState } from 'react';

export default function UploadMusicPage() {
  const { username } = useUserStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [songInfo, setSongInfo] = useState({
    title: '',
    genre: '',
    albumName: '',
    artistName: username || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSongInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    if (!file) {
      setUploadStatus('Please select a file');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading...');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('username', username || '');
      uploadFormData.append('title', songInfo.title || file.name.replace(/\.[^/.]+$/, ""));
      uploadFormData.append('genre', songInfo.genre);
      uploadFormData.append('albumName', songInfo.albumName);
      uploadFormData.append('artistName', songInfo.artistName);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();
      if (response.ok) {
        setUploadStatus(`✅ Upload successful!`);
        setSongInfo({
          title: '',
          genre: '',
          albumName: '',
          artistName: username || ''
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      setUploadStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar username={username} />
      
      <div className="flex flex-col flex-1 min-w-0">
        <NavBar role="listener" />

        <main className="p-6 overflow-auto">
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Upload New Song</h1>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Song Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={songInfo.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 rounded-md text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Artist Name*
                  </label>
                  <input
                    type="text"
                    name="artistName"
                    value={songInfo.artistName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 rounded-md text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Album Name
                  </label>
                  <input
                    type="text"
                    name="albumName"
                    value={songInfo.albumName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 rounded-md text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Genre
                  </label>
                  <input
                    type="text"
                    name="genre"
                    value={songInfo.genre}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 rounded-md text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  MP3 File*
                </label>
                <input
                  type="file"
                  name="file"
                  accept=".mp3"
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-purple-500 file:text-white
                    hover:file:bg-purple-600 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isUploading ? 'Uploading...' : 'Upload Song'}
              </button>

              {uploadStatus && (
                <div className={`p-3 rounded-md ${
                  (uploadStatus || '').startsWith('✅') ? 'bg-green-900/50' : 
                  (uploadStatus || '').startsWith('❌') ? 'bg-red-900/50' : 'bg-blue-900/50'
                }`}>
                  <p className="text-sm">{uploadStatus}</p>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}