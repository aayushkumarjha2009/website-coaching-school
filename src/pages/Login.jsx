import React, { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white font-[Poppins,sans-serif] overflow-hidden">

      {/* Glowing Background Blobs */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full top-[-120px] left-[-120px] animate-pulse z-0" />
      <div className="absolute w-[400px] h-[400px] bg-pink-500/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px] animate-pulse z-0" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_60px_rgba(0,0,0,0.5)] transition-shadow duration-500 ease-in-out">

        <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(255,255,255,0.2)] animate-pulse">
          🔐 Welcome, Citizen
        </h2>

        <form className="space-y-6">
          <div className="relative group">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 bg-white/10 text-white rounded-lg border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-gradient-to-r focus:from-blue-400 focus:to-purple-400"
              required
            />
          </div>

          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 bg-white/10 text-white rounded-lg border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <span
              className="absolute right-4 top-3 text-sm cursor-pointer text-blue-300 hover:text-pink-400 transition-colors"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 transition-all bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold shadow-md hover:shadow-blue-500/50 hover:from-pink-500 hover:to-blue-500 transition-all duration-200 active:scale-95"
          >
            Sign In
          </button>
        </form>

        {/* <div className="text-sm text-gray-400 text-center mt-6 space-y-2">
          <p>
            Don’t have an account?{" "}
            <span className="text-blue-400 hover:underline cursor-pointer">
              Sign up
            </span>
          </p>
          <p>
            <span className="text-pink-400 hover:underline cursor-pointer">
              Forgot Password?
            </span>
          </p>
        </div> */}

        {/* Footer Accent */}
        <div className="mt-8 border-t border-white/10 pt-4 text-xs text-gray-500 text-center">
          A Constitutional Pandu Samiti Production™
        </div>
      </div>
    </div>
  );
}
