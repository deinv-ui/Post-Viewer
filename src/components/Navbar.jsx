import { useState } from "react";
import {
  FaHome,
  FaUser,
  FaChartLine,
  FaSignOutAlt,
  FaChevronRight,
} from "react-icons/fa";
import useAuthStore from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onToggle }) {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      action: () => navigate("/dashboard"),
    },
    { name: "Portfolio", icon: <FaChartLine /> },
    { name: "Profile", icon: <FaUser /> },
    {
      name: "Logout",
      icon: <FaSignOutAlt />,
      action: () => {
        logout();
        localStorage.removeItem("token");
        navigate("/auth/login");
      },
    },
  ];

  const toggleNavbar = () => {
    setExpanded(!expanded);
    if (onToggle) onToggle(!expanded);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 z-50
        ${expanded ? "w-64 bg-white shadow-lg" : "w-20 bg-gray-900 shadow-lg"}`}
    >
      {/* Top section: Logo + Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 relative">
        {/* Logo */}
        <div className="flex items-center gap-2">
          {expanded && (
            <img
              src="/src/assets/blink_logo.png"
              alt="Logo"
              className={`transition-all duration-300 w-32`}
            />
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={toggleNavbar}
          className={`p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-transform duration-300
                      ${expanded ? "rotate-180" : "rotate-0"}`}
        >
          <FaChevronRight className="text-gray-700" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-4 flex flex-col gap-2 p-2">
        {menuItems.map((item, idx) => (
          <a
            key={idx}
            href="#"
            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300
              ${
                expanded
                  ? "text-gray-900 hover:bg-gray-200"
                  : "justify-center text-white hover:bg-gray-700"
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span
              className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${
                expanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
              }`}
            >
              {item.name}
            </span>
          </a>
        ))}
      </nav>

      {/* Footer */}
      {expanded && (
        <div className="p-4 border-t border-gray-200 text-gray-500 text-xs">
          &copy; 2025 Blink Inc.
        </div>
      )}
    </div>
  );
}
