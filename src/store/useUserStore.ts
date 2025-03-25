import internal from "stream";
import { create } from "zustand";
// here i am importing all necessary data (i think mostly everything) from the db for zustand to use for data retrieval.
type Song = {
  song_id: number;
  title: string;
  genre: string;
  file_path: string;
  liked_at?: string;
  played_at?: string;
};

type Playlist = {
  playlist_id: number;
  name: string;
  playlist_art?: string;
};

type UserStore = {
  user_id: number;
  username: string;
  role: string;
  isLoggedIn: boolean;
  likedSongs: Song[];
  playlists: Playlist[];
  streamingHistory: Song[];
  setUser: (username: string, role: string) => void;
  setLikedSongs: (songs: Song[]) => void;
  setPlaylists: (lists: Playlist[]) => void;
  setStreamingHistory: (songs: Song[]) => void;
  logout: () => void;
};
// storing
export const useUserStore = create<UserStore>((set) => ({
  username: "",
  role: "",
  isLoggedIn: false,
  likedSongs: [],
  playlists: [],
  streamingHistory: [],
  setUser: (username, role) =>
    set({ username, role, isLoggedIn: true }),
  setLikedSongs: (songs) =>
    set({ likedSongs: songs }),
  setPlaylists: (lists) =>
    set({ playlists: lists }),
  setStreamingHistory: (songs) =>
    set({ streamingHistory: songs }),
  logout: () =>
    set({
      username: "",
      role: "",
      isLoggedIn: false,
      likedSongs: [],
      playlists: [],
      streamingHistory: [],
    }),
}));
