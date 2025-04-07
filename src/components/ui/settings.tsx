"use client";
import { useState } from "react";
import { Switch } from "@headlessui/react";
import Link from "next/link";
import NavBar from "@/components/ui/NavBar";

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar role="listener" />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        {/* Account Settings Section */}
        <div className="p-4 bg-gray-800 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-2">Account Settings</h2>
          <p className="text-gray-400">
            Manage your account details and security options.
          </p>
          <div className="mt-4">
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow hover:opacity-90 transition">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="p-4 bg-gray-800 rounded-lg shadow-md mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Notifications</h2>
            <p className="text-gray-400 text-sm">
              Toggle notifications on or off.
            </p>
          </div>
          <Switch
            checked={notificationsEnabled}
            onChange={setNotificationsEnabled}
            className={`${
              notificationsEnabled ? "bg-blue-600" : "bg-gray-500"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
          >
            <span className="sr-only">Enable notifications</span>
            <span
              className={`${
                notificationsEnabled ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        {/* Privacy Section */}
        <div className="p-4 bg-gray-800 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-2">Privacy</h2>
          <p className="text-gray-400">
            Control who can see your activity and personal information.
          </p>
          <div className="mt-4">
            <Link
              href="/Privacy"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow hover:opacity-90 transition"
            >
              Privacy Settings
            </Link>
          </div>
        </div>

        {/* Dark Mode Section */}
        <div className="p-4 bg-gray-800 rounded-lg shadow-md mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Dark Mode</h2>
            <p className="text-gray-400 text-sm">
              Toggle between dark and light themes.
            </p>
          </div>
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            className={`${
              darkMode ? "bg-blue-600" : "bg-gray-500"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
          >
            <span className="sr-only">Enable dark mode</span>
            <span
              className={`${
                darkMode ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        {/* Logout Section */}
        <div className="pt-4 border-t border-gray-700">
          <button className="w-full px-4 py-2 bg-red-600 rounded-lg shadow hover:bg-red-700 transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
