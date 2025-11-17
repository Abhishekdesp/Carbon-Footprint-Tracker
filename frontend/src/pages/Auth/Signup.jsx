import { useState } from "react";

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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Signup successful!");
        window.location.href = "/dashboard";
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center 
      bg-gradient-to-br from-green-900 via-blue-800 to-black p-4">

      <div className="bg-gray-900 border border-green-500 
        rounded-xl shadow-xl p-6 w-full max-w-sm pointer-events-auto">

        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Create Account
        </h2>

        <div className="space-y-4">

          <div>
            <label className="block mb-1 font-medium text-gray-300">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-300">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            Sign Up
          </button>

        </div>

        <p className="text-center mt-4 text-sm text-gray-400">
          Already have an account?
          <a href="/login" className="text-blue-400 font-medium ml-1">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
