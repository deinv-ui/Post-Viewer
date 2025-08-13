import { useState } from "react";
import PostList from "@/components/PostList";
import { FaBars, FaTimes } from "react-icons/fa";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="w-full bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/blink_logo.png"
              alt="Blink Logo"
              className="w-24 h-24 object-contain"
            />
          </div>


          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md">
            <nav className="flex flex-col px-6 py-4 gap-3">
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Contact
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <PostList />
      </main>
    </div>
  );
}
