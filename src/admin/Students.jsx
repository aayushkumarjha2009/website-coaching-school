import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function StudentsDashboard({ initialStudents, subjectsData }) {
  const classOptions = ["11th A", "Other"];
  const [students, setStudents] = useState(initialStudents || []);
  useEffect(() => {
    setStudents(initialStudents)
  }, [initialStudents])
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(null);

  // --- Modal (shared for Add + Edit) ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ name: "", stid: "", pass: "", class: classOptions[0], subjects:[] });
  const [isEditing, setIsEditing] = useState(false);

  const deepClone = (v) => JSON.parse(JSON.stringify(v));

  // --- Open Modal ---
  const openAddModal = () => {
    setIsEditing(false);
    setModalData({ name: "", stid: "", pass: "", class: classOptions[0], subjects:[] });
    setModalOpen(true);
  };

  const openEditModal = (idx) => {
    setIsEditing(true);
    setSelectedIdx(idx);
    setModalData(deepClone(students[idx]));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedIdx(null);
    setModalData({ name: "", stid: "", pass: "", class: classOptions[0], subjects:[] });
    setIsEditing(false);
  };
  const saveStudent = async () => {
    console.log(modalData)
    if (!modalData.name.trim() || !modalData.stid) {
      alert("Name and Student ID are required");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_ID}/api/student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: modalData, type: "add-student" }),
      });

      if (!res.ok) {
        throw new Error("Failed to save student");
      }

      const reqe = await res.json();
      const savedStudent = reqe.body


      // Update local state after successful API call
      setStudents((prev) => {
        const copy = deepClone(prev);
        if (isEditing && selectedIdx !== null) {
          copy[selectedIdx] = { ...copy[selectedIdx], ...savedStudent };
        } else {
          copy.push(savedStudent);
        }
        return copy;
      });

      console.log("Saved Student:", savedStudent);
      closeModal();
    } catch (err) {
      window.alert(err);
      alert("Something went wrong while saving student");
    }
  };


  // --- Delete Student ---
  const deleteStudent = (idx) => {
    if (
      window.confirm(
        `Delete student "${students[idx].name}" (ID: ${students[idx].stid})?`
      )
    ) {
      setStudents((prev) => prev.filter((_, i) => i !== idx));
      if (selectedIdx === idx) setSelectedIdx(null);
    }
  };

  // --- Search Filter ---
  const filteredStudents = students.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.stid.toString().toLowerCase().includes(q)
    );
  });

  const [isOtherClass, setIsOtherClass] = useState(false);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6 sm:p-10">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700">
        🎓 Students Dashboard
      </h1>

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 max-w-4xl mx-auto">
        <input
          type="search"
          placeholder="Search by name or ID..."
          className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={openAddModal}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-400 transition font-semibold select-none"
        >
          ＋ Add Student
        </button>
      </div>

      {/* Students List */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg divide-y divide-gray-200">
        {filteredStudents.length === 0 && (
          <p className="p-8 text-center text-gray-400 italic select-none">
            No students found.
          </p>
        )}

        {filteredStudents.map((student, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <motion.div
              key={student.stid}
              layout
              onClick={() => setSelectedIdx(isSelected ? null : idx)}
              className={`cursor-pointer px-6 py-5 flex justify-between items-center transition duration-200 rounded-xl
                ${isSelected
                  ? "bg-indigo-50 ring-2 ring-indigo-400 shadow-md"
                  : "hover:bg-indigo-50"
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div>
                <p className="text-lg font-semibold leading-tight">{student.name}</p>
                <p className="text-sm text-gray-600">ID: {student.stid}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Subjects: {student.subjects?.length || 0}
                </p>
              </div>

              {isSelected && (
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(idx);
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
                  >
                    ✎ Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteStudent(idx);
                    }}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md transition"
                  >
                    ✕ Delete
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* FULLSCREEN MODAL (Add/Edit) */}
      {/* FULLSCREEN MODAL (Add/Edit) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md overflow-auto p-4">
          <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl text-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white">
                {isEditing ? "Edit Student" : "Add Student"}
              </h2>
              <p className="text-indigo-200 text-sm">
                {isEditing
                  ? "Update student information below"
                  : "Fill details to add a new student"}
              </p>
            </div>

            {/* Form */}
            <div className="p-8 space-y-6 overflow-y-auto">
              {/* Full Name */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Full Name</p>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={modalData.name}
                  onChange={(e) =>
                    setModalData({ ...modalData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm bg-white/70 backdrop-blur-md placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition"
                />
              </div>

              {/* Student ID */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Student ID</p>
                <input
                  type="number"
                  placeholder="Enter student ID"
                  value={modalData.stid}
                  onChange={(e) =>
                    setModalData({ ...modalData, stid: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm bg-white/70 backdrop-blur-md placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-green-500 transition"
                />
              </div>

              {/* Password */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Password</p>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={modalData.pass}
                  onChange={(e) =>
                    setModalData({ ...modalData, pass: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm bg-white/70 backdrop-blur-md placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
                />
              </div>

              {/* Class Selection */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Class</p>
                <select
                  value={isOtherClass ? "Other" : modalData.className || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "Other") {
                      setModalData({ ...modalData, className: "" }); // keep actual value empty
                      setIsOtherClass(true);
                    } else {
                      setModalData({ ...modalData, className: value });
                      setIsOtherClass(false);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm bg-white/70 backdrop-blur-md focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition"
                >
                  {classOptions.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>

                {isOtherClass && (
                  <input
                    type="text"
                    placeholder="Enter custom class"
                    value={modalData.className}
                    onChange={(e) =>
                      setModalData({ ...modalData, className: e.target.value })
                    }
                    className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm bg-white/70 backdrop-blur-md focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition"
                  />
                )}
              </div>

              {/* Subjects Selection */}
              {/* Subjects Button */}
              {/* Inside Add/Edit Student Modal */}
              <div className="space-y-4">
                {/* Choose Subjects */}
                <div className="space-y-2">
                  {/* Selected Subjects Display */}
                  <div className="flex flex-wrap gap-4">
                    {(modalData.subjects || []).map((subId) => {
                      const sub = subjectsData.find((s) => s._id === subId);
                      if (!sub) return null;

                      return (
                        <div
                          key={sub._id}
                          className="flex flex-col items-start w-auto min-w-[100px] px-4 py-3 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition cursor-default"
                        >
                          <p className="text-indigo-800 font-semibold text-sm">{sub.name}</p>
                          {sub.level?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {sub.level.map((lvl) => (
                                <span
                                  key={lvl}
                                  className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-medium"
                                >
                                  {lvl}
                                </span>
                              ))}
                            </div>
                          )}
                          {sub.target?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {sub.target.map((t) => (
                                <span
                                  key={t}
                                  className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>



                  {/* Choose Subjects Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setModalData({ ...modalData, showSubjectsModal: true })
                    }
                    className="px-4 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition font-semibold"
                  >
                    Choose Subjects
                  </button>
                </div>
              </div>


              {/* Subjects Modal */}
              {/* Subjects Modal */}
              {modalData.showSubjectsModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl p-6 w-11/12 max-w-3xl shadow-xl">
                    <h3 className="text-2xl font-bold mb-6">Select Subjects</h3>

                    {/* Vertical cards */}
                    <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
                      {subjectsData.map((subject) => {
                        const selected = modalData.subjects || [];
                        const isSelected = selected.includes(subject._id);

                        return (
                          <button
                            key={subject._id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setModalData({
                                  ...modalData,
                                  subjects: selected.filter((id) => id !== subject._id),
                                });
                              } else {
                                setModalData({
                                  ...modalData,
                                  subjects: [...selected, subject._id],
                                });
                              }
                            }}
                            className={`w-full px-4 py-4 rounded-xl border shadow-sm transition flex flex-col gap-2 text-left ${isSelected
                              ? "bg-indigo-50 border-indigo-400 text-indigo-800" // minimalistic selected style
                              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                              }`}
                          >
                            {/* Subject Name */}
                            <p className="font-semibold text-lg">{subject.name || "Untitled"}</p>

                            {/* Level Tags */}
                            {subject.level?.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {subject.level.map((lvl) => (
                                  <span
                                    key={lvl}
                                    className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium"
                                  >
                                    {lvl}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Target Tags */}
                            {subject.target?.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {subject.target.map((t) => (
                                  <span
                                    key={t}
                                    className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-end mt-6 gap-3">
                      <button
                        onClick={() =>
                          setModalData({ ...modalData, showSubjectsModal: false })
                        }
                        className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}



            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 bg-gray-100 px-6 py-4">
              <button
                onClick={closeModal}
                className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveStudent}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
              >
                {isEditing ? "Save Changes" : "Add Student"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default StudentsDashboard;
