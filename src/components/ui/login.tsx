// components/ui/login.tsx

"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Replace /api/user with the correct login API endpoint, which is typically POST.
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password!");
      }

      alert("Login successful! Welcome to Amplifi!");
      window.location.href = "/app";  
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="neon-card relative flex flex-col items-center justify-center w-full max-w-md p-8 rounded-xl shadow-lg space-y-6 border border-gray-800 animate-gradient">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-300 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-fade-in-up">
          Log in to Amplifi
        </h1>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-medium rounded-lg hover:scale-105 transition-all duration-300 glow-button animate-gradient"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-gray-400">
          New to Amplifi?{" "}
          <Link
            href="/signup"
            className="relative text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-white bg-clip-text before:absolute before:left-0 before:bottom-0 before:w-full before:h-[2px] before:bg-gradient-to-r before:from-purple-400 before:via-blue-400 before:to-white before:content-[''] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
            style={{ animationDuration: "700ms" }}
          >
            Join the party!
          </Link>
        </p>
      </div>
    </div>
  );
}
