import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Helper to generate 8-digit hex id
const generateUnitId = () => Math.random().toString(16).slice(2, 10);

function SyllabusEditor({ initialData }) {
  const [syllabus, setSyllabus] = useState(initialData || []);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_ID}/api/master`, {
          method: "POST", headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            type: "aa", // or whichever student id(s) you want  // any other parameters your API expects
          })
        });
        const data = await res.json();
        setSyllabus(data || []);
      } catch (error) {
        console.error("Error fetching syllabus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabus();
  }, []);



  const [selected, setSelected] = useState(null);

  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const HISTORY_LIMIT = 50;

  const containerRef = useRef(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubjectIdx, setModalSubjectIdx] = useState(null);
  const [modalData, setModalData] = useState(null); // units copy for editing

  // Deep clone helper
  const deepClone = (v) => JSON.parse(JSON.stringify(v));

  // Save snapshot for undo (call BEFORE mutation)
  const saveSnapshot = () => {
    setHistory((h) => {
      const snap = deepClone(syllabus);
      const next = [...h, snap];
      if (next.length > HISTORY_LIMIT) next.shift();
      return next;
    });
    setFuture([]); // clear redo stack
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [deepClone(syllabus), ...f]);
    setSyllabus(deepClone(prev));
    setSelected(null);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, deepClone(syllabus)]);
    setSyllabus(deepClone(next));
    setSelected(null);
  };

  // Click outside to deselect
  useEffect(() => {
    function onDocClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSelected(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Add Subject
  const addSubject = () => {
    saveSnapshot();
    setSyllabus((a) => [
      ...a,
      { name: "", target: [], level: [], units: [], id: Date.now().toString() },
    ]);
    setTimeout(() => setSelected(syllabus.length), 50);
  };

  // Delete Subject
  const deleteSubject = (index) => {
    if (
      window.confirm(
        `Delete subject "${syllabus[index].name || "Untitled"}"? This cannot be undone.`
      )
    ) {
      saveSnapshot();
      setSyllabus((a) => a.filter((_, i) => i !== index));
      setSelected(null);
    }
  };

  // Update Subject field
  const updateSubjectField = (index, field, value) => {
    setSyllabus((a) => {
      const copy = deepClone(a);
      copy[index][field] = value;
      return copy;
    });
  };

  // Toggle level (array of strings)
  const toggleLevel = (index, level) => {
    saveSnapshot();
    setSyllabus((a) => {
      const copy = deepClone(a);
      const levels = copy[index].level || [];
      if (levels.includes(level)) {
        copy[index].level = levels.filter((l) => l !== level);
      } else {
        copy[index].level.push(level);
      }
      return copy;
    });
  };

  // -------- Modal handlers --------

  const openEditModal = (sIdx) => {
    setModalSubjectIdx(sIdx);
    // For units, ensure each unit has an id (generate if missing)
    const unitsWithIds = syllabus[sIdx].units.map((unit) => ({
      name: unit.name,
      id: unit.id || generateUnitId(),
    }));
    setModalData(deepClone(unitsWithIds));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
    setModalSubjectIdx(null);
  };

  // Modal: update unit name
  const modalUpdateUnitName = (uIdx, val) => {
    setModalData((d) => {
      const copy = deepClone(d);
      copy[uIdx].name = val;
      return copy;
    });
  };

  // Modal: add unit
  const modalAddUnit = () => {
    setModalData((d) => [
      ...d,
      { name: "", id: generateUnitId() },
    ]);
  };

  // Modal: delete unit
  const modalDeleteUnit = (uIdx) => {
    if (window.confirm(`Delete unit "${modalData[uIdx]?.name || "Untitled"}"?`)) {
      setModalData((d) => {
        const copy = deepClone(d);
        copy.splice(uIdx, 1);
        return copy;
      });
    }
  };

  // Modal: save changes
  const saveModalChanges = () => {
    saveSnapshot();
    setSyllabus((a) => {
      const copy = deepClone(a);
      copy[modalSubjectIdx].units = modalData;
      return copy;
    });
    closeModal();
  };

  // Constants for levels
  const LEVELS = ["Mains", "Neet", "Advanced", "Boards"];

  const SubmitEvent = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_ID}/api/master`, {
        method: "POST", headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "aann", // or whichever student id(s) you want  // any other parameters your API expects
          data: syllabus
        })
      });
      window.location.reload()
    }
    catch {

    }
  }

  return (
    <div
      ref={containerRef}
      className="bg-gray-50 text-gray-900 font-[Poppins,sans-serif] px-6 md:px-10 py-20 relative"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 flex items-center justify-between select-none">
        <h1 className="text-4xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
          📚 Syllabus Editor
        </h1>


        <div className="flex gap-4">
          <button
            onClick={() => {
              SubmitEvent()
            }}
            className="px-4 py-2 rounded-lg font-semibold text-white shadow-md bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 hover:brightness-110 transition-transform transform hover:scale-105"
            title="Submit Syllabus JSON"
          >
            Submit
          </button>
          <button
            onClick={() => {
              const dataStr =
                "data:text/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(syllabus, null, 2));
              const a = document.createElement("a");
              a.href = dataStr;
              a.download = "syllabus.json";
              a.click();
            }}
            className="px-4 py-2 rounded-lg font-semibold text-white shadow-md bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 hover:brightness-110 transition-transform transform hover:scale-105"
            title="Download Syllabus JSON"
          >
            Download JSON
          </button>
        </div>
      </div>

      {/* Subject cards */}
      <div className="max-w-6xl mx-auto space-y-16 z-10">
        {syllabus.length === 0 && (
          <p className="text-gray-500 text-center mb-10">
            No subjects added yet. Click the + button below to add one.
          </p>
        )}

        {syllabus.map((subject, sIdx) => {
          const isSelected = selected === sIdx;

          return (
            <motion.div
              key={subject.id || sIdx}
              onClick={() => setSelected(isSelected ? null : sIdx)}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={`relative mt-20 rounded-3xl p-10 cursor-pointer border ${isSelected
                ? "bg-white border-blue-400 shadow-lg scale-[1.02]"
                : "bg-white border-gray-300 hover:shadow-md hover:border-blue-400"
                } transition-all duration-300`}
            >
              {/* Subject header */}
              <div className="absolute -top-6 left-6 bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400 text-gray-900 font-bold px-5 py-2 rounded-full shadow-sm z-20 whitespace-nowrap select-none">
                {isSelected ? (
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) =>
                      updateSubjectField(sIdx, "name", e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Subject name..."
                    autoFocus
                    className="bg-transparent outline-none text-gray-900 font-bold w-48"
                  />
                ) : (
                  <span>{subject.name || "Untitled Subject"}</span>
                )}
              </div>

              {/* Target Classes as tags (non-editable) */}
              {/* <div className="mt-4 flex flex-wrap gap-2">
                {subject.target.length === 0 ? (
                  <p className="text-gray-400 italic">No target classes</p>
                ) : (
                  subject.target.map((t, i) => (
                    <span
                      key={i}
                      className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full select-none"
                    >
                      {t}
                    </span>
                  ))
                )}
              </div> */}


              {/* Subject header */}
              <div className="absolute -top-6 left-6 bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400 text-gray-900 font-bold px-5 py-2 rounded-full shadow-sm z-20 whitespace-nowrap select-none">
                {isSelected ? (
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) => updateSubjectField(sIdx, "name", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Subject name..."
                    autoFocus
                    className="bg-transparent outline-none text-gray-900 font-bold w-48"
                  />
                ) : (
                  <span>{subject.name || "Untitled Subject"}</span>
                )}
              </div>

              {/* Target Classes */}
              <div
                className="mt-4 flex flex-wrap gap-2 items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {isSelected ? (
                  <>
                    {/* {subject.target.length === 0 && (
        <input
          type="text"
          placeholder="Add target class..."
          className="text-gray-400 italic border-b border-gray-300 focus:border-blue-400 focus:outline-none px-2 py-1 rounded min-w-[160px]"
          onKeyDown={(e) => {
            if (["Enter", ",", " "].includes(e.key)) {
              e.preventDefault();
              const val = e.currentTarget.value.trim();
              if (val && !subject.target.includes(val)) {
                saveSnapshot();
                updateSubjectField(sIdx, "target", [...subject.target, val]);
                e.currentTarget.value = "";
              }
            }
          }}
        />
      )} */}

                    {subject.target.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full select-none"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            saveSnapshot();
                            updateSubjectField(
                              sIdx,
                              "target",
                              subject.target.filter((_, i) => i !== tIdx)
                            );
                          }}
                          className="ml-2 text-blue-500 hover:text-blue-700 font-bold focus:outline-none"
                          title="Remove target"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {/* Always show input to add new tags */}
                    <input
                      type="text"
                      placeholder={subject.target.length === 0 ? "Add tags..." : ""}
                      className="border-b border-gray-300 focus:border-blue-400 focus:outline-none px-2 py-1 rounded min-w-[160px]"
                      onKeyDown={(e) => {
                        if (["Enter", ",", " "].includes(e.key)) {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          if (val && !subject.target.includes(val)) {
                            saveSnapshot();
                            updateSubjectField(sIdx, "target", [...subject.target, val]);
                            e.currentTarget.value = "";
                          }
                        }
                      }}
                    />
                  </>
                ) : (
                  // Show non-editable tags when not selected
                  <>
                    {subject.target.length === 0 ? (
                      <p className="italic text-gray-400" onClick={() => setSelected(isSelected ? null : sIdx)} >No tags</p>
                    ) : (
                      subject.target.map((tag, tIdx) => (
                        <span
                          onClick={() => setSelected(isSelected ? null : sIdx)}
                          key={tIdx}
                          className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full select-none"
                        >
                          {tag}
                        </span>
                      ))
                    )}
                  </>
                )}
              </div>


              {/* Levels */}
              <div className="mt-4 flex flex-wrap gap-3">
                {LEVELS.map((level) => {
                  const active = subject.level.includes(level);
                  return (
                    <button
                      key={level}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLevel(sIdx, level);
                      }}
                      type="button"
                      className={`px-4 py-1 rounded-full text-sm font-semibold transition select-none ${active
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-blue-400 hover:text-white"
                        }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>

              {/* Units list (small cards) */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {subject.units.length === 0 && (
                  <p className="text-gray-400 italic col-span-full">
                    No units yet.
                  </p>
                )}
                {subject.units.map((unit, uIdx) => (
                  <div
                    key={unit.id}
                    className="bg-blue-50 rounded-lg p-4 shadow cursor-default select-none"
                    title={`Unit: ${unit.name || "Untitled"} | ID: ${unit.id}`}
                  >
                    <p className="font-semibold text-blue-700 truncate">
                      {unit.name || "Untitled Unit"}
                    </p>
                    <p className="text-xs text-blue-500 mt-1 select-text">
                      ID: {unit.id}
                    </p>
                  </div>
                ))}
              </div>

              {/* Floating action buttons top-left */}
              {isSelected && (
                <motion.div
                  className="absolute -bottom-5 right-0 flex flex-row gap-2 z-30"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(sIdx);
                    }}
                    title="Edit Chapters"
                    className="px-4 shadow-lg border py-2 rounded-lg bg-white/90 text-indigo-700 hover:bg-white shadow-md transition select-none"
                  >
                    ✎ Edit Chapters
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSubject(sIdx);
                    }}
                    title="Delete Subject"
                    className="px-4 shadow-lg border py-2 rounded-lg bg-white/90 text-red-600 hover:bg-white shadow-md transition select-none"
                  >
                    ✕ Delete Subject
                  </button>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Floating Add Subject Button */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <button
          onClick={handleUndo}
          className={`w-14 h-14 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 shadow-md transition select-none ${history.length === 0
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-gray-300"
            }`}
          title="Undo"
          disabled={history.length === 0}
        >
          ↶
        </button>
        <button
          onClick={handleRedo}
          className={`w-14 h-14 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 shadow-md transition select-none ${future.length === 0
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-gray-300"
            }`}
          title="Redo"
          disabled={future.length === 0}
        >
          ↷
        </button>
        <button
          onClick={addSubject}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg hover:brightness-110 transition select-none"
          title="Add Subject"
        >
          ＋
        </button>
      </div>

      {/* Edit Chapters Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 1000 }}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full mx-auto my-12 p-10 flex flex-col flex-grow shadow-2xl overflow-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-extrabold mb-8 tracking-tight text-gray-900">
                Edit Chapters -{" "}
                <span className="text-indigo-600">
                  {syllabus[modalSubjectIdx]?.name || "Untitled Subject"}
                </span>
              </h2>

              {/* Units editing */}
              <div className="flex flex-col gap-10 flex-grow overflow-auto pr-6">
                {modalData?.length === 0 && (
                  <p className="text-gray-400 italic text-center mt-20">
                    No units yet. Add one.
                  </p>
                )}
                {modalData?.map((unit, uIdx) => (
                  <div
                    key={uIdx}
                    className="border border-gray-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-6 gap-6 flex-wrap">
                      <input
                        type="text"
                        value={unit.name}
                        onChange={(e) => modalUpdateUnitName(uIdx, e.target.value)}
                        placeholder="Unit Name"
                        className="border-b border-indigo-500 text-lg font-semibold flex-grow min-w-[200px] focus:outline-none focus:border-indigo-700 transition-colors duration-300"
                      />
                      <span
                        className="text-gray-600 select-text font-mono tracking-wider text-sm"
                        title="Unit Unique ID"
                      >
                        ID: <span className="text-indigo-600">{unit.id}</span>
                      </span>
                      <button
                        onClick={() => modalDeleteUnit(uIdx)}
                        title="Delete Unit"
                        className="ml-4 text-red-600 hover:text-red-700 font-extrabold text-3xl select-none transition-colors duration-200"
                        aria-label="Delete Unit"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Unit button */}
              <button
                onClick={modalAddUnit}
                className="mt-8 px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition shadow-lg select-none self-start focus-visible:outline-indigo-500"
                title="Add Unit"
              >
                ＋ Add Unit
              </button>

              {/* Modal action buttons */}
              <div className="mt-10 flex justify-end gap-6">
                <button
                  onClick={closeModal}
                  className="px-8 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition select-none focus-visible:outline-indigo-500"
                  title="Cancel editing"
                >
                  Cancel
                </button>
                <button
                  onClick={saveModalChanges}
                  className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition select-none focus-visible:outline-indigo-500"
                  title="Save changes"
                >
                  Save
                </button>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SyllabusEditor;
