import { prisma } from "@prisma/script";
import { NextRequest, NextResponse } from "next/server";

// If you're using bcrypt to hash passwords (recommended)
import bcrypt from "bcryptjs"; // Optional but encouraged

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Fetch user from DB
    const user = await prisma.users.findUnique({
      where: { username },
      select: {
        user_id: true,
        username: true,
        role: true,
        pfp: true,
        password_hash: true, // this should be hashed
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ If using bcrypt for password security:
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // If you are NOT using bcrypt, use this instead:
    // if (user.password_hash !== password) {
    //   return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    // }

    // ✅ Set cookie with user_id
    const res = new NextResponse(JSON.stringify({
      message: "Login successful",
      user_id: user.user_id,
      username: user.username,
      role: user.role,
      pfp: user.pfp || "/default-pfp.jpg",
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    res.cookies.set("user_id", user.user_id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
