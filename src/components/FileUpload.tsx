"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getSignedURL } from "@/app/api/misc/actions";
//import { useUserStore } from "@/app/store/userStore";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [songName, setSongName] = useState<string>("");
  const [artistName, setArtistName] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [albumName, setAlbumName] = useState<string>("");
  //const [currUser, setCurrUser] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const selectedFile = input.files?.[0];

    setFile(selectedFile || null);

    if (fileURL) URL.revokeObjectURL(fileURL);

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setFileURL(url);
    } else {
      setFileURL(null);
    }
  };

  const computeSHA256 = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setStatusMessage("Uploading file...");
    setLoading(true);

    try {
      console.log("Uploading file:", file);

      const checksum = await computeSHA256(file);
      const urlresult = await getSignedURL(file.type, file.size, checksum);

      if ("failure" in urlresult) {
        setStatusMessage(`Error: ${urlresult.failure}`);
        setLoading(false);
        return;
      }

      const url = urlresult.success.url;

      await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      setStatusMessage("File uploaded successfully!");
      setSongName("");
      setArtistName("");
      setGenre("");
      setAlbumName("");
      setFile(null);
      if (fileURL) URL.revokeObjectURL(fileURL);
      setFileURL(null);
    } catch (error) {
      console.error("Upload error:", error);
      setStatusMessage(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-2 bg-white p-6 rounded-lg shadow-md"
      >
        <Label htmlFor="audio">Audio File</Label>
        <Input
          id="audio"
          type="file"
          accept=".mp3,.ogg,.wav"
          onChange={handleFileChange}
        />
        {file && <p className="text-sm text-gray-500">{file.name}</p>}

        <Label htmlFor="songName">Song Title *</Label>
        <Input
          id="songName"
          type="text"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          required
        />

        <Label htmlFor="artistName">Artist Name</Label>
        <Input
          id="artistName"
          type="text"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
        />

        <Label htmlFor="genre">Genre</Label>
        <Input
          id="genre"
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Pop, Rock, Jazz, etc."
        />

        <Label htmlFor="albumName">Album Name</Label>
        <Input
          id="albumName"
          type="text"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
          placeholder="Optional"
        />

        <Button type="submit" disabled={!file || loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>

        {statusMessage && (
          <p className="text-sm text-gray-700">{statusMessage}</p>
        )}
      </form>
    </div>
  );
}
