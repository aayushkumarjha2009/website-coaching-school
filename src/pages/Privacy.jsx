import React from "react";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "1. Introduction",
      text: "We are committed to protecting your privacy. This policy explains how your data is collected and used when using our platform.",
    },
    {
      title: "2. Data Collection",
      text: "We collect information such as name, email, login time, and platform activity to improve user experience.",
    },
    {
      title: "3. Usage",
      text: "Your data helps us deliver personalized experiences, ensure security, and improve performance.",
    },
    {
      title: "4. Sharing Policy",
      text: "We do not sell or share personal data with third parties unless legally required or for core operations.",
    },
    {
      title: "5. Security",
      text: "Your information is encrypted and stored securely using modern practices to prevent unauthorized access.",
    },
    {
      title: "6. Changes",
      text: "We may update this policy and notify users. Please review it periodically to stay informed.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-20 font-[Poppins,sans-serif] overflow-hidden relative">
      {/* Glowing Background */}
      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-purple-500/30 blur-[160px] rounded-full animate-pulse z-0" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-blue-500/30 blur-[160px] rounded-full animate-pulse z-0" />

      <div className="max-w-6xl mx-auto z-10 relative">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-center mb-16">
          🔐 Privacy Policy
        </h1>

        <div className="flex flex-col gap-10">
          {sections.map((section, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-start md:items-center bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl px-6 py-5 shadow-md hover:scale-[1.01] transition-all duration-300"
            >
              <h2 className="text-lg font-semibold min-w-[180px] mb-3 md:mb-0 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                {section.title}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed md:ml-6">
                {section.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
