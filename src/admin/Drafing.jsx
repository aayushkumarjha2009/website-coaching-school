import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/nav";
import NotFoundPage from "../pages/Four04";

function Draft({ acts }) {
  const [activities, setActivities] = useState(acts)
  // useEffect(() => {


  //   async function fetchGitHubFile() {
  //     const response = await fetch(`${process.env.REACT_APP_API_ID}/api/master`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         type: "get-constitution"
  //       }),
  //     });


  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Failed to fetch file");
  //     }

  //     if (response.ok) {

  //       const data = await response.json();
  //       setActivities(data.content)
  //     }
  //     // Use the data as needed
  //   }

  //   fetchGitHubFile()
  // }, [activities])

  const [selected, setSelected] = useState(null);

  // History stacks for undo/redo (store snapshots of activities)
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const HISTORY_LIMIT = 50;

  // container ref to detect outside clicks (to close selected card)
  const containerRef = useRef(null);
  useEffect(() => {
    function onDocClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSelected(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const deepClone = (v) => JSON.parse(JSON.stringify(v));

  // Push current activities snapshot to history (call BEFORE mutation)
  const saveSnapshot = () => {
    setHistory((h) => {
      const snap = deepClone(activities);
      const next = [...h, snap];
      if (next.length > HISTORY_LIMIT) next.shift();
      return next;
    });
    setFuture([]); // new action clears redo stack
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [deepClone(activities), ...f]);
    setActivities(deepClone(prev));
    // setSelected(null);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, deepClone(activities)]);
    setActivities(deepClone(next));
    // setSelected(null);
  };

  // Mutations — call saveSnapshot BEFORE mutating so undo works
  const addCard = () => {
    saveSnapshot();
    setActivities((a) => [...a, { title: "Untitled Article", section: "Section X", detail: "", subsections: [] }]);
    setTimeout(() => setSelected(activities.length), 50); // select new after render
  };

  const moveItem = (from, to) => {
    if (to < 0 || to >= activities.length) return;
    saveSnapshot();
    const updated = deepClone(activities);
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setActivities(updated);
    setSelected(to);
  };

  const deleteItem = (index) => {
    saveSnapshot();
    setActivities((a) => a.filter((_, i) => i !== index));
    setSelected(null);
  };

  // Delete subsection
  const deleteSubsection = (ai, si) => {
    saveSnapshot();
    setActivities((prev) => {
      const updated = deepClone(prev);
      updated[ai].subsections.splice(si, 1);
      return updated;
    });
  };

  // Editing handlers
  const onInputFocus = () => {
    const last = history[history.length - 1];
    if (!last || JSON.stringify(last) !== JSON.stringify(activities)) saveSnapshot();
  };

  const handleTitleEdit = (index, value) => {
    setActivities((prev) => {
      const updated = deepClone(prev);
      updated[index].title = value;
      return updated;
    });
  };
  const handleSectionEdit = (index, value) => {
    setActivities((prev) => {
      const updated = deepClone(prev);
      updated[index].section = value;
      return updated;
    });
  };
  const handleDetailEdit = (index, value) => {
    setActivities((prev) => {
      const updated = deepClone(prev);
      updated[index].detail = value;
      return updated;
    });
  };
  const handleSubEdit = (ai, si, value) => {
    setActivities((prev) => {
      const updated = deepClone(prev);
      updated[ai].subsections[si] = value;
      return updated;
    });
  };

  const [modal, setModal] = useState({ open: false, type: null });

  // Open modal with type "submit" or "reset"
  const openModal = (type) => setModal({ open: true, type });
  const closeModal = () => setModal({ open: false, type: null });

  async function Submit() {
    let se = sessionStorage.getItem("drafting-admin")
    const response = await fetch(`${process.env.REACT_APP_API_ID}/api/master`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "update-constitution",
        token: se,
        data: activities
      }),
    });



    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch file");
    }
    window.location.reload()
  }
  return (
    <div
      ref={containerRef}
      style={{ scrollBehavior: "smooth" }}
      className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white font-[Poppins,sans-serif] px-4 md:px-10 py-20 relative"
    >
      {/* decorative glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl animate-pulse z-0"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse z-0"></div>
      <div className="pb-5 mb-10 flex items-center justify-between max-w-5xl mx-auto text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        <h1 className="text-4xl font-extrabold select-none">✨ Drafting Panel</h1>

        <div className="flex gap-4">
          <button
            onClick={() => {
              openModal("submit")
            }}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold text-sm text-white shadow-lg transition-transform transform hover:scale-105"
          >
            Submit
          </button>
          <button
            onClick={() => openModal("reset")}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold text-sm text-white shadow-lg transition-transform transform hover:scale-105"
          >
            Reset
          </button>
        </div>
      </div>


      {/* Modal */}
      <AnimatePresence>
        {modal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 rounded-xl p-8 max-w-lg mx-4 text-center"
            >
              {modal.type === "submit" && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-cyan-400">Submit Draft</h2>
                  <p className="mb-6 text-white">
                    Are you sure you want to submit your draft? This action cannot be undone.
                  </p>
                  <button
                    onClick={() => { // replace with actual submit logic
                      Submit()
                      closeModal();
                    }}
                    className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-md font-semibold text-white transition mr-4"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold text-white transition"
                  >
                    Cancel
                  </button>
                </>
              )}
              {modal.type === "reset" && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-red-400">Reset Draft</h2>
                  <p className="mb-6 text-white">
                    Are you sure you want to reset your draft? All changes will be lost.
                  </p>
                  <button
                    onClick={() => {
                      // Replace with reset logic
                      setActivities(acts)
                      closeModal();
                    }}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-md font-semibold text-white transition mr-4"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold text-white transition"
                  >
                    Cancel
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="max-w-5xl mx-auto space-y-12 z-10">
        {activities.map((act, index) => {
          const isSelected = selected === index;
          return (
            <motion.div
              key={index}
              onClick={() => selected !== index && setSelected(index)}
              className={`relative mt-20 rounded-3xl p-8 md:p-10 cursor-pointer transition-all duration-300 border ${isSelected
                ? "bg-gray-900 border-cyan-400 ring-1 ring-cyan-300/25 scale-[1.02] shadow-[0_10px_30px_rgba(56,189,248,0.06)]"
                : "bg-gray-900 border-gray-700 hover:shadow-xl hover:border-cyan-400"
                }`}
              whileTap={{ scale: 0.995 }}
            >
              {/* floating badge / title */}
              <div className="absolute -top-6 left-6 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white font-bold px-5 py-2 rounded-full shadow-sm z-10">
                {isSelected ? (
                  <input
                    type="text"
                    value={act.title}
                    onFocus={onInputFocus}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleTitleEdit(index, e.target.value)}
                    className="bg-transparent outline-none text-white font-bold w-48"
                    placeholder="Title..."
                  />
                ) : (
                  <span className="whitespace-nowrap text-sm md:text-base">{act.title}</span>
                )}
              </div>

              {/* section & detail */}
              <div className="mt-4">
                {isSelected ? (
                  <input
                    type="text"
                    value={act.section}
                    onFocus={onInputFocus}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleSectionEdit(index, e.target.value)}
                    className="w-full text-2xl md:text-3xl font-semibold mb-4 text-cyan-300 bg-transparent border-b border-cyan-700/20 focus:border-cyan-400 outline-none py-1"
                    placeholder="Section heading..."
                  />
                ) : (
                  <p className="text-2xl md:text-3xl font-semibold mb-4 text-cyan-300">{act.section}</p>
                )}

                {isSelected ? (
                  <textarea
                    value={act.detail}
                    onFocus={onInputFocus}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleDetailEdit(index, e.target.value)}
                    className="w-full text-lg md:text-xl text-gray-300 bg-transparent border-b border-gray-700/30 focus:border-gray-500 outline-none rounded-md p-3"
                    placeholder="Detail..."
                  />
                ) : (
                  <div className="text-lg md:text-xl text-gray-300" dangerouslySetInnerHTML={{ __html: act.detail }} />
                )}
              </div>

              {/* subsections (only editable when selected) */}
              {isSelected && (
                <div className="mt-6 space-y-3">
                  {act.subsections.map((sub, si) => (
                    <div
                      key={si}
                      className="flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-xl border-l-4 border-cyan-500"
                    >
                      <span className="font-semibold text-cyan-300 whitespace-nowrap">
                        Subsection {String.fromCharCode(65 + si)}:
                      </span>
                      <input
                        value={sub}
                        onFocus={onInputFocus}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleSubEdit(index, si, e.target.value)}
                        className="flex-1 bg-transparent outline-none text-gray-300 placeholder-gray-400"
                        placeholder="Type subsection..."
                      />
                      {/* Delete subsection button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSubsection(index, si);
                        }}
                        title="Delete Subsection"
                        className="text-red-400 hover:text-red-500 px-2 py-1 rounded transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* per-card action buttons */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    className="absolute -bottom-10 right-6 flex gap-3 z-20"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                  >
                    {/* Add Subsection */}
                    <div className="relative group">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveSnapshot();
                          setActivities((prev) => {
                            const updated = deepClone(prev);
                            updated[index].subsections.push("");
                            return updated;
                          });
                        }}
                        title="Add Subsection"
                        className="px-4 py-2 rounded-lg bg-white/6 backdrop-blur-sm hover:bg-white/12 text-white text-lg transition"
                      >
                        ＋
                      </button>
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Add Subsection
                      </span>
                    </div>

                    {/* Up */}
                    <div className="relative group">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveItem(index, index - 1);
                        }}
                        title="Move Up"
                        className="px-4 py-2 rounded-lg bg-white/6 backdrop-blur-sm hover:bg-white/12 text-white text-lg transition"
                      >
                        ↑
                      </button>
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Move Up
                      </span>
                    </div>

                    {/* Down */}
                    <div className="relative group">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveItem(index, index + 1);
                        }}
                        title="Move Down"
                        className="px-4 py-2 rounded-lg bg-white/6 backdrop-blur-sm hover:bg-white/12 text-white text-lg transition"
                      >
                        ↓
                      </button>
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Move Down
                      </span>
                    </div>

                    {/* Delete */}
                    <div className="relative group">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(index);
                        }}
                        title="Delete"
                        className="px-4 py-2 rounded-lg bg-white/6 backdrop-blur-sm hover:bg-white/12 text-white text-lg transition"
                      >
                        ✕
                      </button>
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Delete
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Global floating controls (Undo / Redo / Add) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <div className="relative group">
          <button
            onClick={handleUndo}
            className={`w-14 h-14 flex items-center justify-center rounded-full bg-white/6 backdrop-blur-sm ${history.length === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-white/12"
              } text-white text-2xl transition`}
            title="Undo"
          >
            ↶
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Undo
          </span>
        </div>

        <div className="relative group">
          <button
            onClick={handleRedo}
            className={`w-14 h-14 flex items-center justify-center rounded-full bg-white/6 backdrop-blur-sm ${future.length === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-white/12"
              } text-white text-2xl transition`}
            title="Redo"
          >
            ↷
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Redo
          </span>
        </div>

        <div className="relative group">
          <button
            onClick={addCard}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 text-white text-2xl shadow-lg hover:brightness-110 transition"
            title="Add Article"
          >
            ＋
          </button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Add Article
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Drafting() {
  let se = sessionStorage.getItem("drafting-admin")
  const [set, useset] = useState(null)


  const [activities, setActivities] = useState([])
  const [load, setLoad] = useState(true)
  useEffect(() => {
    if (se !== undefined && se !== "") {
      async function fetchGitHubFile() {
        const response = await fetch(`${process.env.REACT_APP_API_ID}/api/master`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "get-constitution-access",
            token: se
          }),
        });


        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch file");
        }

        if (response.ok) {
          const res = await response.json()
          if (res.success === "ok") {
            useset(true)
          }

        }
        else {
          useset(false)

        }
      }

      fetchGitHubFile()
    }
    else {
      useset(false)
    }

    if (load === true) {
      async function fetchGitHubFile() {
        const response = await fetch(`${process.env.REACT_APP_API_ID}/api/master`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "get-constitution"
          }),
        });


        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch file");
        }

        if (response.ok) {

          const data = await response.json();
          setActivities(data.content)
          setLoad(false)
        }
        // Use the data as needed
      }

      fetchGitHubFile()
    }
  }, [activities, load, set])


  return (<>
    {set === null ? <div className="flex justify-center items-center">
      <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
    </div> : set === true && load === false ? <><Navbar admin adminT={"Constitution"} /><Draft acts={activities} /></> : <><Navbar /><NotFoundPage /></>}
  </>)
}