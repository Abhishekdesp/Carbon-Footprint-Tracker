import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset email sent to:", email);
  };

  return (
   <div className="min-h-screen w-screen flex items-center justify-center 
      bg-gradient-to-br from-green-900 via-blue-800 to-black p-4">

    <div className="bg-gray-900 bg-opacity-80 border border-green-500 
        rounded-xl shadow-xl p-6 w-full max-w-sm">
          
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block mb-1 font-medium">Enter your email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Remember your password?  
          <a href="/login" className="text-blue-600 font-medium ml-1">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
