// src/pages/dashboard/Dashboard.jsx
import { useState } from "react";
import PostList from "@/components/PostList";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  const [navbarExpanded, setNavbarExpanded] = useState(true);

  return (
    <div className="flex w-full min-h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`flex-shrink-0 h-screen transition-all duration-300 ${navbarExpanded ? "w-64" : "w-20"}`}>
        <Navbar onToggle={setNavbarExpanded} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <div className="text-lg font-semibold text-gray-700 truncate">Dashboard</div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 truncate">John Doe</span>
            <img
              src="/src/assets/user_avatar.png"
              alt="User Avatar"
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
          </div>
        </div>

        {/* Main content area */}
        <main className="p-6 flex-1 overflow-auto">
          <PostList />
        </main>
      </div>
    </div>
  );
}
