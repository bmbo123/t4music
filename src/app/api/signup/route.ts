import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/script";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Check if required fields are filled in
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    // Check if user alr. exists (by username)
    const existingUser = await prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*) as count FROM users WHERE username = ${username}
    `;

    if (existingUser[0].count > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into DB
    await prisma.$executeRaw`
      INSERT INTO users (username, email, password_hash) 
      VALUES (${username}, ${email || `${username}@example.com`}, ${hashedPassword})
    `;

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
