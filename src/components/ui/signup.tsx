"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!formData.role) {
      setError("Please select a role.");
      return;
    }

    setError("");

    try {
      const signupRes = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          role: formData.role,
        }),
      });

      const userData = await signupRes.json();
      if (!signupRes.ok) throw new Error(userData.error || "Signup failed");

      // ✅ Set Zustand user info from signup response
      const store = useUserStore.getState();
      store.setUser(userData.user_id, userData.username, userData.role);

      // ✅ Optional: load extra user data (liked songs, playlists, history)
      const extraRes = await fetch("/api/user/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userData.username }),
      });

      const extra = await extraRes.json();
      if (extraRes.ok) {
        store.setLikedSongs(extra.likedSongs || []);
        store.setPlaylists(extra.playlists || []);
        store.setStreamingHistory(extra.streamingHistory || []);
      }

      alert("Signup successful! Welcome to Amplifi 🎧");

      if (userData.role === "artist") router.push("/artistprofile");
      else if (userData.role === "listener") router.push("/home");

      else router.push("/home");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="neon-card relative flex flex-col items-center justify-center w-full max-w-md p-8 rounded-xl shadow-lg space-y-6 border border-gray-800 animate-gradient">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-300 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-fade-in-up">
          Sign up for Amplifi
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="text"
            name="username"
            placeholder="Create Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

          {/* Role selector */}
          <h2 className="text-center text-lg font-semibold bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-4">
            Decide your fate...
          </h2>
          <div className="flex justify-between gap-4 mt-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "listener" })}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                formData.role === "listener"
                  ? "bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              I’m a Listener 🎧
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "artist" })}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                formData.role === "artist"
                  ? "bg-gradient-to-r from-purple-500 via-blue-400 to-pink-500"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              I’m an Artist 🎤
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-medium rounded-lg hover:scale-105 transition-all duration-300 glow-button animate-gradient"
          >
            Sign up
          </button>
        </form>

        <p className="mt-4 text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="relative text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-white bg-clip-text before:absolute before:left-0 before:bottom-0 before:w-full before:h-[2px] before:bg-gradient-to-r before:from-purple-400 before:via-blue-400 before:to-white before:opacity-0 hover:before:opacity-100"
          >
            Log in here!
          </Link>
        </p>
      </div>
    </div>
  );
}