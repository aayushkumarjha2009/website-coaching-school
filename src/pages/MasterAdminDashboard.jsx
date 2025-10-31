import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPageDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Drafting Commission Login",
      description: "Access tools for drafting and reviewing education policies.",
      gradient: "from-green-400 to-blue-500",
      icon: "📝",
      id: "drafting",
      route: "/drafting",
    },
    {
      title: "Teacher Login",
      description: "Login for curriculum progress tracking and student feedback.",
      gradient: "from-purple-400 to-pink-500",
      icon: "👩‍🏫",
      id: "teacher",
      route: "/teacher",
    },
  ];

  // State to keep track of which card is being edited (null if none)
  const [editingCard, setEditingCard] = useState(null);

  // State for new password input
  const [newPassword, setNewPassword] = useState("");

  const openModal = (card) => {
    setEditingCard(card);
    setNewPassword("");
  };

  const closeModal = () => {
    setEditingCard(null);
    setNewPassword("");
  };

  const savePassword = async () => {
    const token = sessionStorage.getItem("master-admin");

    if (!token) {
      alert("No admin token found! Please login.");
      closeModal();
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_ID}/api/master`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // if your backend expects Bearer auth
        },
        body: JSON.stringify({
          token,
          newPassword,
          id: editingCard.id,
          type: "change"
        }),
      });

      const res = await response.json()
      console.log(res)

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || response.statusText}`);
        return;
      }

      alert(`Password changed successfully for "${editingCard.title}"!`);
      closeModal();
    } catch (error) {
      alert("Network error: " + error.message);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 z-10">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl px-8 py-10 max-w-sm w-[320px] hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 group shadow-md relative text-center flex flex-col justify-between"
          >
            <div className=" opacity-10 group-hover:opacity-20 transition" />
            <div>
              <div className="text-4xl mb-6">{card.icon}</div>
              <div
                className={`text-xl font-bold mb-4 bg-gradient-to-r ${card.gradient} text-transparent bg-clip-text`}
              >
                {card.title}
              </div>
              <p className="text-gray-400 text-sm mb-6 min-h-[48px]">
                {card.description}
              </p>
            </div>

            {/* Buttons container */}
            <div className="flex gap-4 mt-auto">
              <button
                onClick={() => openModal(card)}
                className="flex-1 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-all duration-300 shadow-inner"
              >
                Edit
              </button>

              <button
                onClick={() => navigate(`/admin${card.route}`)}
                className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r ${card.gradient} text-white font-semibold transition-all duration-300 hover:brightness-110 shadow-inner`}
              >
                Choose
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingCard && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-lg relative">
            <h2 className="text-2xl font-bold mb-6 text-white">
              Change Password for <span className="text-indigo-400">{editingCard.title}</span>
            </h2>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
                onClick={savePassword}
                disabled={!newPassword.trim()}
                className={`py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
