import { cookies as getCookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await getCookies();
  await cookieStore.delete("user_id");
  return NextResponse.json({ message: "Logged out" });
}

// clearing cookies cause we are so sophisticated purr