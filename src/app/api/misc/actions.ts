"use server";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaClient } from "@prisma/client"; // Correct import

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const prisma = new PrismaClient(); // Proper initialization

const acceptedTypes = ["audio/mpeg", "audio/ogg", "audio/wav"];
const maxFileSize = 1024 * 1024 * 10;

const generateFileName = (type: string) => {
  return `${Date.now()}.${type.split("/")[1]}`;
};

export async function getSignedURL(
  type: string,
  size: number,
  checksum: string
) {
  if (!acceptedTypes.includes(type) || size > maxFileSize) {
    return { failure: "Invalid file or file size!" };
  }

  const fileKey = generateFileName(type);

  const putObj = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET!,
    Key: fileKey,
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
  });

  try {
    const signedURL = await getSignedUrl(s3, putObj, { expiresIn: 5400 });

    // Create song with necessary data
    const song = await prisma.songs.create({
      data: {
        title: "test",
        genre: "Pop",
        duration: 180,
        file_path: fileKey,
        file_format: type.split("/")[1],
        user_id: 1,
        plays_count: 0,
      },
    });

    return { success: { url: signedURL, song } };
  } catch (error) {
    console.error("Database error:", error);
    return {
      failure: `Database operation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export async function getPlaybackURL(fileKey: string) {
  try {
    const getObj = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET!,
      Key: fileKey,
    });

    const signedURL = await getSignedUrl(s3, getObj, { expiresIn: 3600 }); // 1 hour expiry for playback

    return { success: { url: signedURL } };
  } catch (error) {
    console.error("Error generating playback URL:", error);
    return {
      failure: `Failed to generate playback URL: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
