import React from "react";

// Coral Reef — Warm, organic, inviting template  
// Coral/terracotta sidebar with flowing curves and warm typography
const CoralReefTemplate = {
  id: "coral-reef",
  name: "Coral Reef",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop",
  description:
    "A warm, inviting design with coral tones and organic curves — perfect for creative and people-facing roles.",
  layoutStrategy: "DUAL_COLUMN",

  columnWidths: { left: "32%", right: "63%" },
  columnGap: "5%",
  columnMap: {
    skills: "left",
    languages: "left",
    certifications: "left",
    education: "left",
    summary: "right",
    experience: "right",
    projects: "right",
  },

  photoColumn: "left",

  styles: {
    container: "bg-white text-gray-800 shadow-xl relative overflow-hidden",
    font: "font-sans",

    // Coral sidebar background
    __global:
      'before:content-[""] before:absolute before:inset-y-0 before:left-0 before:w-[34%] before:bg-gradient-to-b before:from-[#FF6B6B] before:via-[#ee5a5a] before:to-[#c0392b] before:z-0',

    // Photo
    renderHeaderPhoto: true,
    photoShape: "rounded-full z-20 shrink-0",
    photoSize: "w-28 h-28 mx-auto mb-2",
    photoBorder: "border-[5px] border-white/30 shadow-xl",

    standalonePhotoContainer:
      "flex justify-center items-start w-full pt-4 relative z-10",

    // Header (Right Column)
    headerContainer:
      "flex flex-col items-start py-2 pr-10 relative z-10 min-h-[100px] justify-center",

    name: "font-black text-4xl mb-1 text-gray-900 tracking-tight leading-tight",

    contactInfo:
      "flex flex-wrap items-center text-sm gap-x-4 gap-y-1 text-gray-500 font-medium justify-start w-full mt-1",

    sectionTitle:
      "text-base font-extrabold uppercase tracking-[0.15em] text-gray-900 mb-3 mt-4 relative z-10 pb-1 border-b-2 border-[#FF6B6B]/30",

    sectionContent: "text-[13.5px] leading-relaxed text-gray-700 relative z-10",

    jobTitle: "text-[16px] font-bold text-gray-900",
    companyName: "text-[14px] font-bold text-[#e74c3c]",
    dateLocation:
      "text-xs text-gray-400 uppercase tracking-widest mt-0 mb-1",
  },
};

export default CoralReefTemplate;
