import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth"); // optional
    navigate("/"); // go back to login
  };

  return (
    <nav className="w-full bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-20">

      {/* LEFT SIDE LINKS */}
      <div className="flex gap-6 text-lg font-medium">
        <Link to="/dashboard" className="hover:text-green-600">🏠 Home</Link>
        <Link to="/transportation" className="hover:text-green-600">🚗 Transportation</Link>
        <Link to="/electricity" className="hover:text-green-600">💡 Electricity</Link>
        <Link to="/food" className="hover:text-green-600">🍽 Food</Link>
        <Link to="/lifestyle" className="hover:text-green-600">🌿 Lifestyle</Link>
      </div>

      {/* RIGHT SIDE – PROFILE + LOGOUT */}
      <div className="flex items-center gap-4">

        {/* Profile icon */}
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 bg-green-600 text-white flex items-center justify-center rounded-full text-xl shadow hover:scale-105 transition"
        >
          👤
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
