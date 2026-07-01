import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    navigate("/"); // go back to login
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">

      {/* LEFT SIDE LINKS */}
      <div className="flex gap-6 text-base font-semibold text-gray-600">
        <Link to="/dashboard" className="hover:text-green-650 flex items-center gap-1.5 transition-colors">🏠 Home</Link>
        <Link to="/transportation" className="hover:text-green-650 flex items-center gap-1.5 transition-colors">🚗 Transportation</Link>
        <Link to="/electricity" className="hover:text-green-650 flex items-center gap-1.5 transition-colors">💡 Electricity</Link>
        <Link to="/food" className="hover:text-green-650 flex items-center gap-1.5 transition-colors">🍽 Food</Link>
        <Link to="/lifestyle" className="hover:text-green-650 flex items-center gap-1.5 transition-colors">🌿 Lifestyle</Link>
      </div>

      {/* RIGHT SIDE – PROFILE + LOGOUT */}
      <div className="flex items-center gap-4">

        {/* Profile icon */}
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 bg-green-600 text-white flex items-center justify-center rounded-full text-base shadow-sm hover:bg-green-700 hover:scale-105 active:scale-95 transition-all"
        >
          👤
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-red-650 hover:bg-red-50/50 border border-gray-200 hover:border-red-200 rounded-lg shadow-sm transition-all"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
