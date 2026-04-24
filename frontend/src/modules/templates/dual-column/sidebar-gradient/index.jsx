import React from "react";

// Sidebar Gradient
const SidebarGradientTemplate = {
  id: "sidebar-gradient",
  name: "Sidebar Gradient",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop",
  description: "Clean white body with a striking, saturated gradient sidebar.",
  layoutStrategy: "DUAL_COLUMN",

  columnWidths: { left: "30%", right: "65%" },
  columnGap: "5%",
  columnMap: {
    skills: "left",
    languages: "left",
    education: "right",
    certifications: "left",
    summary: "right",
    experience: "right",
    projects: "right",
  },

  // Tell layout engine photo belongs in left column
  photoColumn: "left",

  styles: {
    container: "bg-white text-gray-800 shadow-xl relative",
    font: "font-sans",

    // Gradient Sidebar
    __global:
      'before:content-[""] before:absolute before:inset-y-0 before:left-0 before:w-[32%] before:bg-gradient-to-br before:from-violet-600 before:to-fuchsia-600 before:z-0',

    // Photo
    renderHeaderPhoto: true,
    photoShape: "rounded-full z-20 shrink-0",

    // FIXED HERE (removed mt-12)
    photoSize: "w-32 h-32 mx-auto mb-1",

    photoBorder: "border-[4px] border-white/20 shadow-xl",

    // Keep photo at very top
    standalonePhotoContainer:
      "flex justify-center items-start w-full pt-2 relative z-10",

    // Header (Right Column)
    headerContainer:
      "flex flex-col items-start py-1 pr-12 relative z-10 min-h-[100px] justify-center",

    name: "font-black text-4xl mb-0 text-gray-900 tracking-tight leading-none",

    contactInfo:
      "flex flex-wrap items-center text-sm gap-x-4 gap-y-1 text-gray-500 font-medium justify-start w-full mt-1",

    sectionTitle:
      "text-xl font-bold uppercase text-gray-900 mb-1 mt-2 relative z-10",

    sectionContent: "text-[14px] leading-relaxed text-gray-700 relative z-10",

    jobTitle: "text-lg font-bold text-gray-900",

    companyName: "text-[15px] font-bold text-violet-600",

    dateLocation: "text-xs text-gray-400 uppercase tracking-widest mt-0 mb-1",
  },
};

export default SidebarGradientTemplate;
