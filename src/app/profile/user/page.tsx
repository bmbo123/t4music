"use client";
import { useUserStore } from "@/store/useUserStore";
import UserCard from '../components/User/UserCard';
import UserStats from '../components/User/UserStats';
import ProfileSettingsButton from '../components/ProfileSettingsButton';
import DeleteAccountButton from '../components/DeleteAccountButton';
import UserAlbums from '../components/User/UserAlbums';
import ArtistsFollowing from '../components/User/ArtistsFollowing';
import NavBar from '@/components/ui/NavBar';

export default function UserProfilePage() {
  const { username } = useUserStore(); // Get username from the store

  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar />
      {/* Pass username as a prop */}
      <UserCard username={username} />

      {/* Main content container */}
      <div className="relative max-w-6xl mx-auto px-6 pb-10 space-y-12 -mt-14">
        <UserStats />
        <UserAlbums isArtist={false} />
        <ArtistsFollowing />
        <div className="flex flex-wrap gap-6 justify-center">
          <ProfileSettingsButton />
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
