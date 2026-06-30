import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log("SIGNUP BUTTON CLICKED");

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Signup successful!");
        window.location.href = "/";
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center 
      bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4"
    >
      <div
        className="bg-white border border-gray-100 
        rounded-2xl shadow-xl p-8 w-full max-w-sm pointer-events-auto"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-green-800">
          Create Account
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-green-600/10"
          >
            Sign Up
          </button>
        </div>

        <p className="text-center mt-4 text-sm text-gray-500">
          Already have an account?
          <Link to="/" className="text-green-600 font-semibold ml-1 hover:underline hover:text-green-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
