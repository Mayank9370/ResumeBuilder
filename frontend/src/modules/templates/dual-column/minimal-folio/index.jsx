import React from "react";

// Minimal Folio - Ultra minimal, large square photo, lots of whitespace
const MinimalFolioTemplate = {
  id: "minimal-folio",
  name: "Minimal Folio",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop", // Temporary placeholder
  description:
    "Ultra-minimalist design featuring a large square profile picture and abundant whitespace.",
  layoutStrategy: "DUAL_COLUMN",

  // Configuration for the dual column engine
  columnWidths: { left: "45%", right: "45%" },
  columnGap: "10%",

  pagination: {
    buffer: 35, // Helps ensure left column doesn't directly touch the absolute bottom threshold padding
  },

  columnMap: {
    summary: "right",
    experience: "right",
    projects: "right",
    skills: "right",
    education: "right",
    certifications: "right",
    languages: "right",
  },

  styles: {
    container: "bg-white text-gray-900 shadow-sm border border-gray-100",
    font: "font-sans",

    // Minimal Square Photo
    renderHeaderPhoto: true,
    photoShape: "rounded-none", // Sharp square
    photoSize:
      "w-35 h-35 grayscale hover:grayscale-0 transition-all duration-500",
    photoBorder: "border-none shadow-sm",

    headerContainer:
      "flex flex-col items-center p-0 mb-0 border-b border-gray-100",
    name: "font-thin text-5xl mb-1 text-gray-800 tracking-tight mt-2",
    contactInfo:
      "flex flex-wrap text-xs gap-x-8 gap-y-1 text-gray-400 justify-center tracking-widest uppercase",

    // Minimal section headers
    sectionTitle:
      "text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-0 mt-0",
    sectionContent: "text-[13px] leading-relaxed text-gray-600 font-light",

    // Clean entries
    jobTitle: "text-md font-medium text-gray-900",
    companyName: "text-sm text-gray-500",
    dateLocation: "text-xs text-gray-400 tracking-wider",
  },
};

export default MinimalFolioTemplate;
