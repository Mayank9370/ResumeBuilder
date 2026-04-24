import React from "react";

// Glassmorphism Folio - Frosted glass effect over a gradient background
const GlassmorphismFolioTemplate = {
  id: "glassmorphism-folio",
  name: "Glass Folio",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop",
  description:
    "Ultra-modern frosted glass UI against a flowing gradient backdrop.",
  layoutStrategy: "DUAL_COLUMN",

  // Balanced widths with smaller gap
  columnWidths: { left: "36%", right: "61%" },
  columnGap: "3%",

  columnMap: {
    summary: "left",
    skills: "left",
    experience: "right",
    projects: "right",
    education: "right",
    certifications: "left",
    languages: "left",
  },

  styles: {
    // Background container
    container:
      "bg-gradient-to-br from-indigo-200 via-sky-200 to-emerald-200 text-slate-800 shadow-2xl relative",
    font: "font-sans",

    // Header photo
    headerLayout: "PHOTO_LEFT_STACKED_TEXT",
    renderHeaderPhoto: true,
    photoShape: "rounded-full backdrop-blur-md bg-white/30",
    photoSize: "w-32 h-32 p-1",
    photoBorder: "border border-white/50 shadow-lg",

    // Glass Header (reduced spacing)
    headerContainer:
      "flex flex-col items-start p-8 pr-[190px] min-h-[200px] justify-center mb-6 backdrop-blur-xl bg-white/40 border-b border-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.08)] relative [&_.photo-container]:absolute [&_.photo-container]:right-8 [&_.photo-container]:top-1/2 [&_.photo-container]:-translate-y-1/2 [&_.photo-container]:m-0",

    name: "font-extrabold text-4xl mb-1 text-slate-800 tracking-tight mt-0 mix-blend-color-burn",

    contactInfo:
      "flex flex-wrap text-sm gap-x-5 gap-y-1 text-slate-600 justify-start font-medium mix-blend-color-burn",

    // Section titles (removed big margin)
    sectionTitle:
      "text-xs font-bold uppercase text-indigo-900 mb-3 bg-white/50 backdrop-blur-md border border-white/60 shadow-sm px-3 py-1 rounded-full inline-block",

    // Section card (compact)
    sectionContent:
      "text-[13px] leading-relaxed text-slate-700 font-medium bg-white/30 backdrop-blur-md p-3 rounded-lg border border-white/40 shadow-sm mb-3",

    jobTitle: "text-[15px] font-bold text-slate-900",

    companyName: "text-[14px] font-semibold text-indigo-700",

    dateLocation:
      "text-[10px] font-bold text-slate-500 uppercase tracking-wider",
  },
};

export default GlassmorphismFolioTemplate;
