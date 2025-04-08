"use client";
import UserCard from '../components/User/UserCard';
import ProfileSettingsButton from '../components/ProfileSettingsButton';
import DeleteAccountButton from '../components/DeleteAccountButton';
import UserPlaylists from '../components/User/UserPlaylists';
import ArtistsFollowing from '../components/User/ArtistsFollowing';
import NavBar from '@/components/ui/NavBar';
import TopArtists from "../components/User/TopArtists";
import TopTracks from "../components/User/TopTracks";


export default function UserProfilePage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar />
      {/* Hero-style banner at top */}
      <UserCard />

 {/*i moved the "my albums down a bit"*/}

      <div className="relative max-w-6xl mx-auto px-6 pb-10 space-y-12 mt-6">
      {/* i removed the user stats and instead put it right below the username*/}


        {/* Albums section (includes the dedicated "Liked Songs" album) */}
        <UserPlaylists />
        {/* Artists the user follows */}
        <ArtistsFollowing />

        <div>
  <h2 className="text-2xl font-bold mb-4">Top Artists This Month</h2>
  <TopArtists />
</div>

<div>
  <h2 className="text-2xl font-bold mb-4">Top Tracks This Month</h2>
  <TopTracks />
</div>


        {/* Profile settings and account management */}
        <div className="flex flex-wrap gap-6 justify-center">
          <ProfileSettingsButton />
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}