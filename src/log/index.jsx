import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";

function Tooltip({ text }) {
  return (
    <span className="absolute bottom-full mb-2 w-max rounded bg-gray-800 px-3 py-1 text-xs text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 select-none">
      {text}
    </span>
  );
}

// function MiniBarChart({ data }) {
//   const max = Math.max(...data);
//   return (
//     <svg className="w-full h-8" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
//       {data.map((val, i) => {
//         const height = (val / max) * 18;
//         return (
//           <rect
//             key={i}
//             x={i * 12 + 2}
//             y={20 - height - 1}
//             width="8"
//             height={height}
//             fill="#4F46E5"
//             rx="1"
//           />
//         );
//       })}
//     </svg>
//   );
// }

export default function HomeAdmin() {

  const cards = [
    {
      link: "/syllabus",
      title: "Edit Syllabus",
      icon: (
        <svg
          className="w-10 h-10 text-blue-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
      ),
      description: "Modify and update course syllabus content.",
      // progress: 65,
      tooltip: "65% syllabus updated",
      action: "Edit Now",
      badge: 3,
      chartData: [3, 6, 7, 9, 5, 4, 7],
    },
    {
      link: "/students",
      title: "Students List",
      icon: (
        <svg
          className="w-10 h-10 text-green-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
        </svg>
      ),
      description: "View and manage all enrolled students.",
      // count: 342,
      tooltip: "Total students enrolled",
      action: "View List",
      badge: 12,
      chartData: [8, 7, 10, 12, 9, 8, 11],
    },
    {
      link: "/progress",
      title: "View Student Progress",
      icon: (
        <svg
          className="w-10 h-10 text-purple-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 12h3l3 8 4-16 3 10 2-4h3" />
        </svg>
      ),
      description: "Track performance & analytics for students.",
      // progress: 82,
      tooltip: "Average progress: 82%",
      action: "Check Progress",
      chartData: [10, 15, 13, 18, 14, 20, 23],
    },
  ];
  const navigate = useNavigate()

  return (
    <Sidebar>

      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <header className="max-w-7xl mx-auto mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1 max-w-lg">
            Manage your courses, students, and progress with ease.
          </p>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map(({ link, title, icon, description, progress, count, tooltip, action, badge }, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  {icon}
                  {badge ? (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full px-2 leading-none select-none">
                      {badge}
                    </span>
                  ) : null}
                </div>

                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              </div>

              <p className="text-gray-700 mb-4">{description}</p>

              {/* Mini Chart */}
              {/* {chartData && (
                  <div className="mb-4">
                    <MiniBarChart data={chartData} />
                  </div>
                )} */}

              {typeof progress === "number" ? (
                <div className="mb-6 relative w-full h-3 rounded-full bg-gray-200 overflow-hidden group">
                  <Tooltip text={tooltip} />
                  <div
                    className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              ) : null}

              {typeof count === "number" ? (
                <div className="mb-6 text-3xl font-bold text-gray-900">{count.toLocaleString()}</div>
              ) : null}

              <button
                onClick={() => {
                  navigate(`/admin${link}`)
                }}
                type="button"
                className="mt-auto bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-2 focus:ring-offset-1 text-white font-semibold rounded-lg px-5 py-3 transition"
              >
                {action}
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-gray-500 text-sm">
        © 2025 AdminPro. All rights reserved.
      </footer>

    </Sidebar>
  );
}