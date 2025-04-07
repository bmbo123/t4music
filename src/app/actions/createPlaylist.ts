<<<<<<< HEAD
export async function createPlaylist(name: string, user_id: number, playlist_art: string) {
  console.log("Sending playlist to API:", { name, user_id, playlist_art });
=======
// src/app/actions/createPlaylist.ts
export async function createPlaylist(name: string, user_id: number) {
  console.log("Sending playlist to API:", { name, user_id });
>>>>>>> parent of d342f95 (YESSSSSSSSSSSSSSSSSSSS IT WORKED)

  const res = await fetch("/api/playlists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
<<<<<<< HEAD
    body: JSON.stringify({ name, user_id, playlist_art }),
=======
    body: JSON.stringify({ name, user_id }),
>>>>>>> parent of d342f95 (YESSSSSSSSSSSSSSSSSSSS IT WORKED)
  });

  const data = await res.json();
  console.log("API response:", data);

  if (!res.ok) throw new Error("Failed to create playlist");

  return data;
}
