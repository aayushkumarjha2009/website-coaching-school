
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";


function Navbar({admin, adminT}) {
      const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>

              <header
        className={`fixed mb-40 top-0 w-full z-50 backdrop-blur-sm bg-gray-950/80 transition-shadow duration-300 ${
          scrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to={'/'}>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 bg-clip-text">
            {admin?adminT : "Tracker"}
          </h1>
          </Link>
          {admin ? "" : <nav className="flex gap-6 items-center text-sm font-medium">
            <Link to={"/login"} className="hover:text-green-400 transition cursor-pointer">Login</Link>
            <Link to={"/admin"} className="hover:text-green-400 transition cursor-pointer">Admin</Link>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="hover:text-cyan-400 transition"
              >
                More ▾
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 bg-gray-800 text-sm mt-2 rounded-lg shadow-lg py-2 w-48 z-50">
                  <Link
                    to={"/education-policy"}
                    className="block px-4 py-2 hover:bg-gray-700 transition"
                  >
                    Education Policy
                  </Link>
                  <Link
                    to={"/privacy"}
                    className="block px-4 py-2 hover:bg-gray-700 transition"
                  >
                    Privacy
                  </Link>
                </div>
              )}
            </div>
          </nav>}
        </div>
      </header>
    </div>
  )
}

export default Navbar