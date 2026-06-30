import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset email sent to:", email);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center 
      bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">

      <div className="bg-white border border-gray-100 
        rounded-2xl shadow-xl p-8 w-full max-w-sm">
          
        <h2 className="text-2xl font-bold text-center mb-6 text-green-800">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Enter your email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-green-600/10"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-500">
          Remember your password?  
          <a href="/" className="text-green-600 font-semibold ml-1 hover:underline hover:text-green-700">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
