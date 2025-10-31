import React, { useEffect, useState } from "react";
import aayush from '../imgs/aayush.JPG'
import aryan from '../imgs/aryan.png'
import daniyal from '../imgs/daniyal.png'
import ayush from '../imgs/ayush.jpg'
import divyansh from '../imgs/divyansh.png'
import mysha from '../imgs/mysha.png'

const samitiMembers = [
  { name: "Aayush Kumar Jha", title: "Dept. of Infinite Drafting", image: aayush },
  { name: "Aryan Anand", title: "Minister of Loopholes", image: aryan },
  { name: "Ayush Raj", title: "Advisor", image: ayush },
  { name: "Daniyal Siddique", title: "CEO of secularism", image: daniyal },
  { name: "Divyansh", title: "CEO of Telecasting", image: divyansh },
  { name: "Ujjawal", title: "Most Hardworking Member", image: "https://i.pravatar.cc/150?img=45" },
  { name: "Mysha", title: "Bhaijaan", image: mysha },
];

export default function EducationPolicy() {
  const [acts, setActs] = useState([])
  useEffect(() => {


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
        setActs(data.content)
      }
      // Use the data as needed
    }

    fetchGitHubFile()
  }, [])

  const [openAct, setOpenAct] = useState(null);
  const toggleAct = (idx) => setOpenAct(openAct === idx ? null : idx);

  return (
    <div style={{ scrollBehavior: "smooth" }} className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white font-[Poppins,sans-serif] px-4 md:px-10 py-20">
      <h1 className="text-5xl font-extrabold text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">
        📜 Education Policy
      </h1>

      <div className="max-w-5xl mx-auto mb-12 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 border border-gray-700 rounded-2xl shadow-xl p-6 md:p-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Built on the Backs of Pandus™</h2>
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
          These “education policies” aren’t just inspired — they’re straight-up lifted from the <span className="italic">Pandushāstra</span>™.
        </p>
        <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
          Special thanks to the absolute legends at the Pandu Samiti™.
        </p>
        <a
          href="#pandu-members"
          className="inline-block px-6 py-3 text-white bg-gradient-to-r from-cyan-600 to-indigo-700 hover:from-cyan-700 hover:to-indigo-800 transition-all rounded-full shadow-lg hover:scale-105 active:scale-95"
          onMouseEnter={() => {
            const element = document.getElementById("pandu-members");
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
        >
          👑 Meet the Samiti Legends
        </a>

      </div>

      <div className="max-w-5xl mx-auto space-y-16">
        {acts.length > 0 ? <>{acts.map((act, idx) => (
          <div key={idx} onClick={() => toggleAct(idx)} className={`relative bg-gray-900 border border-gray-700 rounded-3xl p-8 md:p-10 shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-cyan-400 ${openAct === idx ? "ring-2 ring-cyan-300/30 scale-[1.01]" : ""}`}>
            <div className="absolute -top-6 left-6 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white font-bold text-base md:text-lg px-6 py-2 rounded-full shadow-sm z-10">
              {act.title}
            </div>
            <div className="absolute top-6 right-6 text-2xl text-cyan-400 transition-transform duration-300">
              {openAct === idx ? "🕽️" : "▶️"}
            </div>
            <div className="mt-4">
              <p className="text-2xl md:text-3xl font-semibold mb-4 text-cyan-300">{act.section}</p>
              <div className="text-lg md:text-xl text-gray-300" dangerouslySetInnerHTML={{ __html: act.detail }}></div>
            </div>
            {openAct === idx && (
              <div className="mt-6 space-y-4 text-gray-400 transition-all">
                {Array.isArray(act.subsections) ? act.subsections.map((sub, i) => (
                  <p key={i} className="text-base md:text-lg leading-relaxed bg-gray-800 px-4 py-2 rounded-xl border-l-4 border-cyan-500">
                    <span className="font-semibold text-cyan-300">Subsection {String.fromCharCode(65 + i)}:</span> {sub}
                  </p>
                )) : ""}
              </div>
            )}
          </div>
        ))}</>
          : <div className="flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          </div>}
      </div>

      {/* Pandu Members Section */}
      <section id="pandu-members" className="max-w-7xl mx-auto px-6 py-24">
        <div className="border-4 border-blue-500 rounded-3xl bg-gradient-to-br from-gray-800 via-gray-900 to-black p-10 md:p-16 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-blue-300 mb-6">The Highly Qualified Pandu Samiti Sadasya List™</h2>
          <p className="text-center text-lg md:text-xl font-medium text-blue-400 mb-16 max-w-2xl mx-auto">
            These are the <span className="italic">most decorated beings</span> in the Pandu multiverse.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-12">
            {samitiMembers.map((member, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg border border-blue-500 shadow-lg rounded-3xl p-8 flex items-center gap-6 transition-all hover:shadow-blue-600 hover:-translate-y-2 hover:scale-[1.02] duration-300 group">
                <img src={member.image} alt={member.name} className="w-32 h-32 rounded-2xl object-cover border-4 border-blue-600 group-hover:border-blue-400 transition-all" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-lg text-blue-300 font-medium">{member.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dictatorship Card */}
      <section id="constitutional-dictatorship" className="relative max-w-7xl mx-auto mt-24 px-6 md:px-16 py-16 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white border-4 border-blue-600 rounded-[2.5rem] shadow-lg overflow-hidden isolate">
        <div className="absolute -top-20 -left-32 w-96 h-96 bg-blue-400 opacity-30 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-24 -right-28 w-96 h-96 bg-indigo-500 opacity-25 rounded-full blur-[120px] pointer-events-none animate-ping"></div>
        <div className="relative z-10 flex flex-col items-center gap-8 text-center">
          <div className="px-6 py-2 bg-blue-800 border border-blue-400 rounded-full shadow-lg backdrop-blur-md inline-flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <span className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide">Constitutional Dictatorship</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-blue-200 tracking-tight leading-tight">
            Suggestions are Welcome, but Power is Absolute
          </h2>
          <p className="max-w-4xl text-lg md:text-xl leading-relaxed text-blue-300 font-medium">
            Feel free to drop your ideas, opinions, thoughts, manifestos, and dreams. <br />
            But implementation lies solely in the hands of the Legislative Body — a.k.a. the <span className="text-white font-semibold">Pandu Samiti™</span>.<br />
            Dictatorship... but make it constitutional.
          </p>
          <div className="mt-4">
            <span className="inline-block px-6 py-2 text-sm md:text-base font-bold bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-full shadow-lg tracking-widest uppercase">
              🧒‍ Article 420: “Dictatorship, But With Aesthetics”
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
