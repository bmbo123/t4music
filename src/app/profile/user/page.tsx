"use client";
import { useState } from "react";
import UserCard from '../components/User/UserCard';
import UserStats from '../components/User/UserStats';
import ProfileSettingsButton from '../components/ProfileSettingsButton';
import DeleteAccountButton from '../components/DeleteAccountButton';
import UserAlbums from '../components/User/UserAlbums';
import ArtistsFollowing from '../components/User/ArtistsFollowing';
import NavBar from '@/components/ui/NavBar';
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";

export default function UserProfilePage() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Toggle the upload modal visibility
  const toggleUploadModal = () => {
    setShowUploadModal(!showUploadModal);
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar />
      {/* Hero-style banner at top */}
      <UserCard />

      {/* Main content container with a smooth overlap for a seamless transition */}
      <div className="relative max-w-6xl mx-auto px-6 pb-10 space-y-12 -mt-14">
        {/* Listener statistics */}
        <UserStats />

        {/* Albums section (includes the dedicated "Liked Songs" album) */}
        <UserAlbums isArtist={true} /> {/* Change to isArtist={true} for artist */}

        {/* Artists the user follows */}
        <ArtistsFollowing />

        {/* Profile settings and account management */}
        <div className="flex flex-wrap gap-6 justify-center">
          <ProfileSettingsButton />
          <DeleteAccountButton />
        </div>

        {/* Create Song Button */}
        <div className="flex justify-center mt-6">
          <Button onClick={toggleUploadModal}>Create Song</Button>
        </div>

        {/* Show the Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <FileUpload />
              <Button className="mt-4" onClick={toggleUploadModal}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
