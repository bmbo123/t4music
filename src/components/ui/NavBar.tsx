"use client";

import Link from "next/link";
import { Menu } from "@headlessui/react";
import { FaHome, FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
import { useUserStore } from "@/app/store/userStore"; // Import Zustand store
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface NavBarProps {
  role?: "listener" | "artist" | "admin";
}

export default function NavBar({ role = "listener" }: NavBarProps) {
  //const { username } = useUserStore(); // Retrieve user from Zustand store

  // Dummy notifications for demonstration
  const notifications = [
    { id: 1, message: "New song released: 'Summer Vibes'" },
    { id: 2, message: "Your album 'Chill Vibes' was liked" },
    { id: 3, message: "New artist trending near you" },
  ];

  return (
    <nav className="bg-black text-white px-5 py-2 shadow-md">
      <div className="w-full flex items-center justify-between px-4">
        {/* Left Section: Home Icon */}
        <div className="flex items-center">
          <Link href="/home" className="hover:text-gray-300">
            <FaHome size={24} />
          </Link>
        </div>

        <div className="flex-1 mx-6">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="What do you want to play?"
              className="w-full py-2 px-3 rounded-full bg-gray-800 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <FaSearch size={18} className="text-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="flex items-center hover:text-gray-300">
              <FaBell size={20} />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="py-1">
                {notifications.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-300">
                    No notifications.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <Menu.Item key={notification.id}>
                      {({ active }) => (
                        <div
                          className={classNames(
                            active ? "bg-gray-700" : "",
                            "px-4 py-2 text-sm text-gray-300"
                          )}
                        >
                          {notification.message}
                        </div>
                      )}
                    </Menu.Item>
                  ))
                )}
              </div>
            </Menu.Items>
          </Menu>

          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="flex items-center">
              <FaUserCircle size={24} className="hover:text-gray-300" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href={
                        role === "artist" ? "/profile/artist" : "/profile/user"
                      }
                      className={classNames(
                        active ? "bg-gray-700 text-white" : "text-gray-300",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/settings"
                      className={classNames(
                        active ? "bg-gray-700 text-white" : "text-gray-300",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                {role === "listener" && (
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/select-role"
                        className={classNames(
                          active ? "bg-gray-700 text-white" : "text-gray-300",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Request Role Change
                      </Link>
                    )}
                  </Menu.Item>
                )}
                <Menu.Item>
                  {({ focus }) => (
                    <button
                      className={classNames(
                        focus ? "bg-gray-700 text-white" : "text-gray-300",
                        "block w-full text-left px-4 py-2 text-sm"
                      )}
                      onClick={() => {
                        useUserStore.getState().clearUser();
                        window.location.href = "/";
                      }}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </nav>
  );
}
