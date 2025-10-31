import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col justify-center items-center text-white relative overflow-hidden font-[Poppins,sans-serif] px-6">
      {/* Floating glowing dots */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[140px] rounded-full top-[-100px] left-[-100px] animate-pulse z-0" />
      <div className="absolute w-[400px] h-[400px] bg-pink-500/20 blur-[130px] rounded-full bottom-[-100px] right-[-100px] animate-pulse z-0" />

      {/* Main content */}
      <div className="relative z-10 text-center">
        <h1 className="text-[10rem] leading-none font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 drop-shadow-2xl animate-text bg-[300%] bg-pos-0 hover:bg-pos-100 transition-all duration-[4s] ease-in-out">
          404
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white shadow-xl hover:brightness-110 transition-all duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
