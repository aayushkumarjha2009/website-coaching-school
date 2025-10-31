import React, { useState } from "react";

export default function InputWithResultModal() {
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-gray-900 flex items-center justify-center px-6 text-white font-[Poppins,sans-serif] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-100px] left-[-80px] w-[400px] h-[400px] bg-indigo-500/20 blur-[140px] rounded-full animate-pulse z-0" />
      <div className="absolute bottom-[-100px] right-[-80px] w-[400px] h-[400px] bg-purple-500/20 blur-[140px] rounded-full animate-pulse z-0" />

<div className="p-2">
      <div className="z-10 bg-white/5 border border-white/10 backdrop-blur-2xl px-8 py-10 rounded-2xl shadow-xl text-center space-y-6 max-w-md w-full">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Enter Something Cool 😎
        </h1>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here..."
          className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.02] transition-all duration-300 font-semibold"
        >
          Show Result
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-20">
          <div className="bg-[#1e1e1e] text-white rounded-2xl px-8 py-6 w-[90%] max-w-md shadow-2xl border border-white/10 relative text-center">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Your Result</h2>
            <p className="text-lg text-gray-300 mb-6">{input || "Nothing entered!"}</p>
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition font-semibold"
            >
              Close
            </button>
          </div>
          </div>
      )}
      </div>
    </div>
  );
}
