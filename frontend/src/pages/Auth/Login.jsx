import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

console.log("API URL =", import.meta.env.VITE_API_URL);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("LOGIN BUTTON CLICKED");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Login Successful!");
        navigate("/dashboard");
      } else {
        alert(data.error || "Invalid email or password");
      }

    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center 
      bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">

      <div className="bg-white border border-gray-100 
        rounded-2xl shadow-xl p-8 w-full max-w-sm pointer-events-auto">

        <h1 className="text-3xl font-bold text-green-800 text-center mb-2">
          Carbon Footprint Tracker 🌱
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Measure • Reduce • Sustain
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white text-gray-800 
            border border-gray-200 rounded-lg focus:ring-2 
            focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white text-gray-800 
            border border-gray-200 rounded-lg focus:ring-2 
            focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
          />

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 bg-green-600 text-white font-semibold 
            rounded-lg hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-green-600/10"
          >
            Login
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-green-600 text-sm hover:underline hover:text-green-700"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="mt-2 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-green-600 font-semibold hover:underline hover:text-green-700"
          >
            Sign up
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
