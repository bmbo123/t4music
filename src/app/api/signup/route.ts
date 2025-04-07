import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/script";
import bcrypt from "bcryptjs";

interface users {user_id: number; username: string; role: string;};

export async function POST(request: Request) {
  try {
    const { username, email, password,role } = await request.json();

    // Check if required fields are filled in
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if user alr. exists (by username)
    const existingUser = await prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*) as count FROM users WHERE username = ${username}
    `;

    if (existingUser[0].count > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into DB
    await prisma.$executeRaw`
      INSERT INTO users (username, email, password_hash, role) 
      VALUES (${username}, ${
      email || `${username}@example.com`
    }, ${hashedPassword}, ${role})
    `;

    const user: users[] = await prisma.$queryRawUnsafe(`
      SELECT user_id, username, role FROM users WHERE username = '${username}'
    `);

    if (!user || !user[0]) {
      return NextResponse.json({ error: "Failed to fetch user after signup" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
