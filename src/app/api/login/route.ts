import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/script";
import bcrypt from "bcryptjs";

type User = {
  id: string;
  username: string;
  password_hash: string;
  email?: string;
  role: string;
};

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    console.log("🔹 Logging in:", username);

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    // Ensure Prisma query returns a typed array
    const users: User[] = await prisma.$queryRaw<User[]>`
      SELECT * FROM users WHERE username = ${username} LIMIT 1;
    `;

    console.log("🔹 Found user:", users);

    // Check if user exists in the returned array
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const userData = users[0]; // Extract the first user

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, userData.password_hash);
    console.log("🔹 Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful" }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
