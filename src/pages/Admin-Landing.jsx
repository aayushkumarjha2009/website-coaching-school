import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Drafting Commission Login",
      description: "Access tools for drafting and reviewing education policies.",
      gradient: "from-green-400 to-blue-500",
      icon: "📝",
      route: "/drafting",
      id: "drafting",
    },
    {
      title: "Teacher Login",
      description: "Login for curriculum progress tracking and student feedback.",
      gradient: "from-purple-400 to-pink-500",
      icon: "👩‍🏫",
      route: "/home",
      id: "teacher",
    },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null); // { type: "success"|"error", message: "..." }

  const openModal = (card) => {
    setSelectedCard(card);
    setPassword("");
    setModalOpen(true);
    setAlert(null); // clear alert when modal opens
  };

  const closeModal = () => {
    setModalOpen(false);
    setPassword("");
    setAlert(null);
  };

  // Auto-clear alert after 4 seconds
  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  const handleSubmit = async () => {
    if (!password.trim()) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_ID}/api/master`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
          id: selectedCard.id,
          type: "admin-login",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        sessionStorage.setItem(`${selectedCard.id}-admin`, data.token)
        setAlert({ type: "success", message: `Login successful for ${selectedCard.title}` });

        // Navigate after a short delay to let user see success message
        setTimeout(() => {
          navigate(`/admin${selectedCard.route}`);
          closeModal();
        }, 1000);
      } else {
        setAlert({ type: "error", message: data.message || "Login failed" });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Error: " + error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-950 to-black text-white font-[Poppins,sans-serif] flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Animated Glowing Background */}
      <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-purple-500/30 blur-[160px] rounded-full animate-pulse z-0" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] bg-blue-500/30 blur-[160px] rounded-full animate-pulse z-0" />

      <h1 className="text-5xl font-extrabold mb-16 z-10 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 animate-text bg-[200%] bg-pos-0 hover:bg-pos-100 transition-all duration-[3s] ease-in-out">
        🛠️ Admin Panel
      </h1>

      {/* Alert Message */}
      {alert && (
        <div
          className={`fixed top-8 z-500000000 max-w-sm w-full px-6 py-4 rounded-lg text-center font-semibold ${
            alert.type === "success"
              ? "bg-green-600 text-green-100"
              : "bg-red-600 text-red-100"
          } shadow-lg`}
          role="alert"
        >
          {alert.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 z-10">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl px-8 py-10 max-w-sm w-[320px] hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 group shadow-md relative text-center flex flex-col justify-between cursor-default"
          >
            <div className="top-0 left-0 w-full h-full rounded-3xl border border-white/10 opacity-10 group-hover:opacity-20 transition" />
            <div>
              <div className="text-4xl mb-6">{card.icon}</div>
              <div
                className={`text-xl font-bold mb-4 bg-gradient-to-r ${card.gradient} text-transparent bg-clip-text`}
              >
                {card.title}
              </div>
              <p className="text-gray-400 text-sm mb-6 min-h-[48px]">{card.description}</p>
            </div>
            <button
              onClick={() => openModal(card)}
              className={`mt-auto w-full py-2.5 rounded-xl bg-gradient-to-r cursor-pointer ${card.gradient} text-white font-semibold transition-all duration-300 hover:brightness-110 shadow-inner`}
            >
              Login
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 bg-opacity-90 rounded-2xl p-8 max-w-md w-full shadow-lg relative">
            <h2 className="text-2xl font-bold mb-6 text-white">
              Enter Password for <span className="text-indigo-400">{selectedCard.title}</span>
            </h2>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg p-3 mb-6 bg-gray-800 text-white border border-gray-700 focus:outline-indigo-500"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="py-2 px-5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!password.trim()}
                className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
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
