import React from "react";

// Neon Matrix — Cyberpunk-inspired with neon green on dark sidebar
// Dark charcoal sidebar with electric green accents and monospace headers
const NeonMatrixTemplate = {
  id: "neon-matrix",
  name: "Neon Matrix",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop",
  description:
    "A cyberpunk-inspired layout with electric neon green accents and a dark sidebar — built for tech, gaming, and developer roles.",
  layoutStrategy: "DUAL_COLUMN",

  columnWidths: { left: "30%", right: "65%" },
  columnGap: "5%",
  columnMap: {
    skills: "left",
    technical_skills: "left",
    languages: "left",
    certifications: "left",
    education: "left",
    summary: "right",
    experience: "right",
    projects: "right",
  },

  photoColumn: "left",

  styles: {
    container: "bg-white text-gray-800 shadow-xl relative",
    font: "font-sans",

    // Dark charcoal sidebar
    __global:
      'before:content-[""] before:absolute before:inset-y-0 before:left-0 before:w-[32%] before:bg-gradient-to-b before:from-[#1a1a2e] before:via-[#16213e] before:to-[#0f0f23] before:z-0',

    // Photo
    renderHeaderPhoto: true,
    photoShape: "rounded-lg z-20 shrink-0",
    photoSize: "w-28 h-28 mx-auto mb-2",
    photoBorder: "border-[3px] border-[#39FF14]/40 shadow-[0_0_15px_rgba(57,255,20,0.2)]",

    standalonePhotoContainer:
      "flex justify-center items-start w-full pt-4 relative z-10",

    // Header (Right Column) — sleek, no decoration
    headerContainer:
      "flex flex-col items-start py-2 pr-10 relative z-10 min-h-[100px] justify-center",

    name: "font-black text-4xl mb-1 text-gray-900 tracking-tight leading-tight",

    contactInfo:
      "flex flex-wrap items-center text-sm gap-x-4 gap-y-1 text-gray-500 font-mono font-medium justify-start w-full mt-1",

    // Neon green accent bar before section titles
    sectionTitle:
      'text-sm font-black uppercase tracking-[0.2em] text-gray-900 mb-3 mt-5 flex items-center gap-2 relative z-10 before:content-[""] before:w-2.5 before:h-2.5 before:bg-[#39FF14] before:rounded-sm before:shadow-[0_0_8px_rgba(57,255,20,0.5)]',

    sectionContent:
      "text-[13.5px] leading-[1.7] text-gray-700 relative z-10",

    jobTitle: "text-[16px] font-bold text-gray-900",
    companyName: "text-[14px] font-bold text-[#16213e]",
    dateLocation:
      "text-xs font-mono text-gray-400 uppercase tracking-widest mt-0 mb-1",
  },
};

export default NeonMatrixTemplate;
