import React from "react";

// Vanguard - Modern tech, photo-driven template
const VanguardTemplate = {
  id: "vanguard",
  name: "Vanguard",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop", // Temporary placeholder
  description:
    "A modern, photo-driven template perfect for creative and tech roles.",
  layoutStrategy: "DUAL_COLUMN",

  // Configuration for the dual column engine
  columnWidths: { left: "60%", right: "35%" }, // 35/60 split with 5% gap
  columnGap: "5%",
  columnMap: {
    summary: "right",
    skills: "right",
    technical_skills: "right",
    education: "right",
    languages: "left",
    experience: "left",
    projects: "left",
    certifications: "left",
  },

  // Styling injected into ParticleRenderer
  styles: {
    // Container and typography
    container: "bg-white text-gray-800 shadow-2xl",
    font: "font-sans",

    // Header Configuration (Crucial for Photo)
    headerLayout: "PHOTO_LEFT_STACKED_TEXT",
    renderHeaderPhoto: true,
    photoShape: "rounded-2xl", // Modern rounded square
    photoSize: "w-32 h-32 mr-2",
    photoBorder: "border-4 border-white shadow-lg",

    // Header Layout: we use a subtle card effect
    headerContainer:
      "flex flex-col items-start bg-gray-50 rounded-xl p-8 mb-8 border-none relative overflow-hidden",
    name: "font-extrabold text-4xl mb-2 text-gray-900 tracking-tight z-10",
    contactInfo:
      "flex flex-wrap text-sm gap-x-6 gap-y-2 text-gray-600 justify-start z-10",

    // Section Headers
    sectionTitle:
      "text-lg font-bold uppercase tracking-wider text-indigo-600 mb-6 border-b border-indigo-100 pb-2 mt-8",
    sectionContent: "text-sm leading-relaxed text-gray-700",

    // Job/Experience entries
    jobTitle: "text-lg font-bold text-gray-900",
    companyName: "text-md font-medium text-indigo-600",
    dateLocation:
      "text-xs font-semibold text-gray-500 uppercase tracking-widest",
  },
};

export default VanguardTemplate;
