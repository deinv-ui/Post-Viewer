// src/layouts/MainLayout.jsx
import { useState } from "react";
import Navbar from "@/components/Navbar";
import useAuthStore from "@/stores/authStore";

export default function MainLayout({ children }) {
  const [navbarExpanded, setNavbarExpanded] = useState(true);

  // Get user info from the store
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex w-full min-h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar / Navbar */}
      <div
        className={`flex-shrink-0 h-screen transition-all duration-300 ${
          navbarExpanded ? "w-64" : "w-20"
        }`}
      >
        <Navbar onToggle={setNavbarExpanded} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <div className="text-lg font-semibold text-gray-700 truncate">
            Welcome back, {user?.username || "User"}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 truncate">{user?.email || ""}</span>
            <img
              src={user?.avatar_url || "/src/assets/user_avatar.png"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
          </div>
        </div>

        {/* Main content area */}
        <main className="p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
