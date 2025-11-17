import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

console.log("API URL =", import.meta.env.VITE_API_URL);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, []);

  const handleSubmit = async () => {
    console.log("LOGIN BUTTON CLICKED");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
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
      bg-gradient-to-br from-green-900 via-blue-800 to-black p-4">

      <div className="bg-gray-900 border border-green-500 
        rounded-xl shadow-xl p-6 w-full max-w-sm pointer-events-auto">

        <h1 className="text-3xl font-bold text-green-300 text-center mb-2">
          Carbon Footprint Tracker 🌱
        </h1>

        <p className="text-green-100 text-center mb-6">
          Measure • Reduce • Sustain
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800/60 text-green-100 
            border border-green-400/40 rounded-lg focus:ring-2 
            focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800/60 text-green-100 
            border border-blue-400/40 rounded-lg focus:ring-2 
            focus:ring-blue-500"
          />

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-green-500 
            via-blue-500 to-green-600 text-white font-semibold 
            rounded-lg hover:scale-105 transition-transform"
          >
            Login
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-blue-300 text-sm hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="mt-2 text-center text-green-200 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-green-400 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
