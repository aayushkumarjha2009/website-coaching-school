import React, { useState, useEffect } from "react";



export default function MasterAdmin() {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" }); // type: "error" or "success"

  // Auto dismiss alert after 4 seconds
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ message: "", type: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ID}/api/master`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pass: password, type:"connect" }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem("master-admin", data.token)
        setAlert({ message: "Access granted! Welcome to Master Admin Panel.", type: "success" });
        setShowModal(false);
        setPassword("");
        setTimeout(() => {
          window.location.href = "/master-admin/dashboard"
        }, 500);
      } else {
        setAlert({ message: data.message || "Wrong password! Access denied.", type: "error" });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setAlert({ message: "Something went wrong. Please try again.", type: "error" });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-950 to-gray-900 text-white font-[Poppins,sans-serif] overflow-hidden">
      {/* Alert Bar */}
      {alert.message && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity ${
            alert.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Glowing Background Blobs */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full top-[-120px] left-[-120px] animate-pulse z-0" />
      <div className="absolute w-[400px] h-[400px] bg-pink-500/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px] animate-pulse z-0" />
      <div className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-red-500/30 blur-[140px] rounded-full animate-pulse z-0" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-red-700/20 blur-[140px] rounded-full animate-pulse z-0" />

      <div className="z-10 text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-orange-400">
          🧠 Master Admin Panel
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Highly restricted access. Proceed only if you're authorized.
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-400 rounded-xl font-semibold text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/40"
        >
          🔓 Master Access
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-20">
          <div className="bg-[#1c1c1c] text-white rounded-2xl px-8 py-6 w-[90%] max-w-md shadow-2xl border border-white/10 relative">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">
              Enter Master Password
            </h2>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-black/30 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-gray-400 mb-5"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 transition font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
