import React from "react";

// Midnight Accent
const MidnightAccentTemplate = {
  id: "midnight-accent",
  name: "Midnight Accent",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop", // Temporary placeholder
  description:
    "Sophisticated dark mode header using a vibrant electric-blue accent.",
  layoutStrategy: "DUAL_COLUMN",

  columnWidths: { left: "35%", right: "60%" },
  columnGap: "5%",
  columnMap: {
    summary: "left",
    skills: "left",
    technical_skills: "left",
    languages: "left",
    education: "right",
    experience: "right",
    projects: "right",
    certifications: "right",
  },

  styles: {
    container: "bg-white text-gray-800 shadow-md",
    font: "font-sans pt-0", // removed pt just in case

    // Electric blue popping against midnight
    headerLayout: "PHOTO_LEFT_STACKED_TEXT",
    renderHeaderPhoto: true,
    photoShape: "rounded-full",
    photoSize: "w-36 h-36 border-4 border-white",
    photoBorder: "ring-4 ring-cyan-400 p-1 bg-white",

    headerContainer:
      "flex flex-col items-start p-12 pr-[200px] min-h-[220px] justify-center mb-6 border-b-[6px] border-cyan-400 rounded-b-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] relative [&_.photo-container]:absolute [&_.photo-container]:right-12 [&_.photo-container]:top-1/2 [&_.photo-container]:-translate-y-1/2 [&_.photo-container]:m-0",
    name: "font-bold text-5xl mb-2 text-[#0F172A] tracking-tight mt-0",
    contactInfo:
      "flex flex-wrap text-[13px] gap-x-6 gap-y-2 text-cyan-800 justify-start font-medium",

    // Cyan accents
    sectionTitle:
      'text-[15px] font-black uppercase tracking-[0.15em] text-[#0F172A] mb-4 mt-5 first:mt-0 flex items-center gap-2 before:content-[""] before:bg-cyan-400 before:w-3 before:h-3 before:rounded-full break-inside-avoid',
    sectionContent: "text-[14px] leading-[1.7] text-gray-700 font-medium",

    jobTitle: "text-[17px] font-bold text-[#0F172A]",
    companyName: "text-[15px] font-bold text-cyan-600",
    dateLocation: "text-xs font-bold text-gray-400 uppercase tracking-widest",
  },
};

export default MidnightAccentTemplate;
