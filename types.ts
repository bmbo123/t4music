export enum UsersRole {
  LISTENER = "listener",
  ARTIST = "artist",
  ADMIN = "admin",
}

export interface User {
  user_id: number;
  username: string;
  pfp?: string;
  email: string;
  password_hash: string;
  role: UsersRole;
  created_at?: Date;
  updated_at?: Date;
}

export interface Album {
  Album_id?: number;
  album_art?: string;
  title: string;
  user_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Song {
  song_id: number;
  title: string;
  Album_id?: number;
  genre?: string;
  duration: number;
  file_path: string;
  file_format?: string;
  uploaded_at?: Date;
  plays_count?: number;
  user_id?: number;
  URL?: string;
  liked_at?: string;
  played_at?: string;
  album?: Album;
  users?: Partial<User>; //ensures types and useUserStore are synced
}

export interface Playlist {
  playlist_id: number;
  playlist_art?: string;
  name: string;
  created_id: number;
  updated_at?: Date;
  user_id: number;
}

export interface LibraryItem {
  library_id: number;
  user_id: number;
  item_id: number;
  item_type: "song" | "album" | "playlist";
  created_id: number;
  updated_at?: Date;
}

export interface Like {
  like_id: number;
  listener_id: number;
  song_id: number;
  liked_at?: Date;
}

export interface Follow {
  follow_id: number;
  user_id_a: number;
  user_id_b: number;
  follow_at?: Date;
}

export interface StreamingHistory {
  stream_id: number;
  listener_id: number;
  user_id: number;
  song_id: number;
  played_at?: Date;
}
