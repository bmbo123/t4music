"use client";
import { useState, useEffect } from "react";

export default function FollowButton({ targetUserId }: { targetUserId: number }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFollow = async () => {
      try {
        const res = await fetch(`/api/follow/check?target=${targetUserId}`);
        const data = await res.json();
        setIsFollowing(data.isFollowing);
      } catch (err) {
        console.error("Follow check failed:", err);
      } finally {
        setLoading(false);
      }
    };
    checkFollow();
  }, [targetUserId]);

  const handleFollow = async () => {
    try {
      await fetch(`/api/follow/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow toggle failed:", err);
    }
  };

  if (loading) return null;

  return (
    <button
      onClick={handleFollow}
      className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 shadow-md
        ${
          isFollowing
            ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:opacity-80"
            : "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white hover:scale-105"
        }`}
    >
      {isFollowing ? "Following 💫" : "Follow +"}
    </button>
  );
}
