import React from "react";

// Azure Blueprint — Engineering blueprint aesthetic
// Structured, geometric, with deep navy header and blueprint-style grid lines
const AzureBlueprintTemplate = {
  id: "azure-blueprint",
  name: "Azure Blueprint",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop",
  description:
    "An engineering-inspired blueprint layout with structured grid lines and deep navy tones — ideal for technical and analytical roles.",
  layoutStrategy: "DUAL_COLUMN",

  columnWidths: { left: "38%", right: "57%" },
  columnGap: "5%",
  columnMap: {
    summary: "left",
    skills: "left",
    technical_skills: "left",
    languages: "left",
    certifications: "left",
    education: "right",
    experience: "right",
    projects: "right",
  },

  styles: {
    container:
      "bg-[#FAFCFF] text-gray-800 shadow-lg border border-[#E2E8F0] relative",
    font: "font-sans",

    renderHeaderPhoto: false,

    // Deep navy header with blueprint grid overlay
    headerContainer:
      "flex flex-col items-start p-10 mb-4 bg-[#0F2744] relative overflow-hidden",
    name: "font-black text-4xl mb-2 text-white tracking-tight z-10",
    contactInfo:
      "flex flex-wrap text-sm gap-x-6 gap-y-2 text-blue-200/80 justify-start font-medium z-10",

    // Blueprint-style sections with left bar
    sectionTitle:
      'text-sm font-black uppercase tracking-[0.2em] text-[#1E40AF] mb-4 mt-6 flex items-center gap-2 before:content-[""] before:w-1 before:h-5 before:bg-[#3B82F6] before:rounded-full',
    sectionContent:
      "text-[13.5px] leading-[1.7] text-gray-700 pl-3 border-l border-blue-100",

    jobTitle: "text-[16px] font-bold text-[#0F2744]",
    companyName: "text-[14px] font-semibold text-[#2563EB]",
    dateLocation:
      "text-xs font-semibold text-gray-400 uppercase tracking-widest",
  },
};

export default AzureBlueprintTemplate;
