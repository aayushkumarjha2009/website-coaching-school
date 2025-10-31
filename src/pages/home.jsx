import React from "react";
import { Link } from "react-router-dom";

export default function Home() {

  return (
    <>
    <div className="relative flex flex-col min-h-screen bg-gray-950 text-white font-[Poppins,sans-serif] overflow-x-hidden">

      {/* Glowing Background Blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-3xl animate-pulse z-0"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl animate-pulse z-0"></div>

      {/* Fixed Blurry Navbar */}

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow z-10 text-center px-6 pt-40 pb-10">
        <h2 className="text-5xl font-extrabold mb-6 tracking-tight text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 bg-clip-text">
          📘 Tracking Your Learning
        </h2>
        <p className="text-gray-400 max-w-xl mb-10">
          Organizes your progress by chapter, coaching, and subject — in one sleek dashboard.
        </p>
        <div className="flex gap-6">
          <Link to={"/login"} className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 font-semibold transition-all hover:scale-105 active:scale-95">
            Login
          </Link>
          <Link to={"/education-policy"} className="px-6 py-3 rounded-xl border border-gray-700 hover:border-green-400 transition-all hover:scale-105 active:scale-95">
            Education Policy
          </Link>
        </div>
      </main>
    </div>

    </>
  );
}
