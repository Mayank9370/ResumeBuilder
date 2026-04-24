import React from "react";

// Arctic Frost — Icy blue tones with frosted glass sidebar
// Cool blue-white palette with a translucent icy sidebar panel
const ArcticFrostTemplate = {
  id: "arctic-frost",
  name: "Arctic Frost",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop",
  description:
    "A crisp, icy blue design with a frosted sidebar panel and cool typography — ideal for finance, consulting, and corporate roles.",
  layoutStrategy: "DUAL_COLUMN",

  columnWidths: { left: "33%", right: "62%" },
  columnGap: "5%",
  columnMap: {
    skills: "left",
    education: "left",
    languages: "left",
    certifications: "left",
    summary: "right",
    experience: "right",
    projects: "right",
  },

  photoColumn: "left",

  styles: {
    container: "bg-white text-gray-800 shadow-xl relative overflow-hidden",
    font: "font-sans",

    // Frosted ice-blue sidebar
    __global:
      'before:content-[""] before:absolute before:inset-y-0 before:left-0 before:w-[35%] before:bg-gradient-to-b before:from-[#E0F2FE] before:via-[#BAE6FD] before:to-[#7DD3FC] before:z-0 before:opacity-70',

    // Photo — frosted ring
    renderHeaderPhoto: true,
    photoShape: "rounded-full z-20 shrink-0",
    photoSize: "w-28 h-28 mx-auto mb-2",
    photoBorder: "border-[5px] border-white/60 shadow-lg ring-2 ring-sky-200",

    standalonePhotoContainer:
      "flex justify-center items-start w-full pt-4 relative z-10",

    // Header (Right Column)
    headerContainer:
      "flex flex-col items-start py-2 pr-10 relative z-10 min-h-[100px] justify-center",

    name: "font-extrabold text-4xl mb-1 text-slate-900 tracking-tight leading-tight",

    contactInfo:
      "flex flex-wrap items-center text-sm gap-x-4 gap-y-1 text-sky-700/70 font-medium justify-start w-full mt-1",

    // Icy blue section markers
    sectionTitle:
      'text-sm font-bold uppercase tracking-[0.18em] text-sky-900 mb-3 mt-5 pb-1.5 border-b-2 border-sky-200 relative z-10 flex items-center gap-2 before:content-[""] before:w-2 before:h-2 before:rounded-full before:bg-sky-400',

    sectionContent:
      "text-[13.5px] leading-[1.7] text-gray-700 relative z-10",

    jobTitle: "text-[16px] font-bold text-slate-900",
    companyName: "text-[14px] font-semibold text-sky-600",
    dateLocation:
      "text-xs text-gray-400 uppercase tracking-widest mt-0 mb-1",
  },
};

export default ArcticFrostTemplate;
