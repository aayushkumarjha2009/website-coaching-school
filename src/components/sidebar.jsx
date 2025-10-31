import React, { Children, useState } from 'react'
import { useNavigate } from 'react-router-dom';




// Sidebar icons
function DashboardIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}
function SyllabusIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 19h16M4 5h16M4 12h16" />
    </svg>
  );
}
function StudentsIcon() {
  return (
    <svg
      className="w-6 h-6"
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
  );
}
function ProgressIcon() {
  return (
    <svg
      className="w-6 h-6"
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
  );
}


function Sidebar({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const sidebarItems = [
    { link: "/dashboard", name: "Dashboard", icon: <DashboardIcon />, active: true },
    { link: "/syllabus", name: "Syllabus", icon: <SyllabusIcon /> },
    { link: "/students", name: "Students", icon: <StudentsIcon /> },
    { link: "/progress", name: "Progress", icon: <ProgressIcon /> },
  ];
  const navigate = useNavigate()
  return (
    <>
      <div className="flex h-screen bg-gray-100 overflow-auto">

        <div
          className={`fixed inset-0 bg-black/30 backdrop-blur-md z-40 transition-opacity lg:hidden ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />

        {/* Overlay drawer sidebar for screens < lg */}
        <aside
          className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
          aria-label="Sidebar Navigation"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-2xl font-bold text-indigo-600 whitespace-nowrap">AdminPro</span>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col mt-4 space-y-1">
            {sidebarItems.map(({ name, icon, active, link }, idx) => (
              <div
                key={idx}
                onClick={() => { navigate(`/admin${link}`) }}
                href="#"
                className={`flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition rounded-md ${active ? "bg-indigo-100 text-indigo-700 font-semibold" : ""
                  }`}
              >
                <span className="w-6 h-6">{icon}</span>
                <span>{name}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Static sidebar for large screens (≥ lg) */}
        <aside
          className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:shadow-lg"
          aria-label="Sidebar Navigation"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-2xl font-bold text-indigo-600 whitespace-nowrap">AdminPro</span>
          </div>
          <nav className="flex flex-col mt-4 space-y-1 flex-1 overflow-y-auto">
            {sidebarItems.map(({ name, icon, active, link }, idx) => (
              <div
                key={idx}
                onClick={() => { navigate(`/admin${link}`) }}
                className={`flex items-center cursor-pointer gap-4 px-4 py-3 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition rounded-md ${active ? "bg-indigo-100 text-indigo-700 font-semibold" : ""
                  }`}
              >
                <span className="w-6 h-6">{icon}</span>
                <span>{name}</span>
              </div>
            ))}
          </nav>
        </aside>


        <div className="flex-1 flex flex-col overflow-auto">
          {/* Top Navigation */}
          <header className="flex items-center justify-between bg-white shadow-sm px-6 py-4 sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded lg:hidden"
            >
              {/* Hamburger icon */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Hamburger button only visible below lg */}

            {/* Search box */}
            <div className="relative max-w-md w-full">
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-6">
              {/* Notifications */}
              <button
                aria-label="Notifications"
                className="relative text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-5-5.917V4a2 2 0 1 0-4 0v1.083A6.002 6.002 0 0 0 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-600 ring-2 ring-white" />
              </button>

              {/* User */}
              <div className="flex items-center space-x-3 cursor-pointer group relative">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="User avatar"
                  className="w-10 h-10 rounded-full"
                />
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          {children}
        </div>
      </div>
    </>
  )
}

export default Sidebar