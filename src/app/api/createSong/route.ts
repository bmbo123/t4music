import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function POST(request: Request) {
  try {
    const { title, artist, filePath } = await request.json();

    // Add the song to the database
    const song = await prisma.songs.create({
      data: {
        title,
        user_id: 1,
        file_path: filePath,
        genre: "Unknown", // Set genre or pass from form if needed
        duration: 180, // Set duration or compute from file
        uploaded_at: new Date(),
      },
    });

    return NextResponse.json({ song }, { status: 201 });
  } catch (error) {
    console.error("Error creating song:", error);
    return NextResponse.json({ error: "Failed to create song" }, { status: 500 });
  }
}
