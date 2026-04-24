import React from "react";

// Retro Typewriter - Vintage newspaper/typewriter style
const RetroTypewriterTemplate = {
  id: "retro-typewriter",
  name: "Retro Typewriter",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop",
  description:
    "Vintage typewriter styling with a classic newspaper column feel.",
  layoutStrategy: "DUAL_COLUMN",

  columnWidths: { left: "48%", right: "49%" },
  columnGap: "3%",

  columnMap: {
    experience: "left",
    projects: "left",
    summary: "right",
    skills: "right",
    education: "right",
    certifications: "right",
    languages: "right",
  },

  styles: {
    // Sepia paper background
    container:
      "bg-[#f4ebd0] text-[#3e3a35] shadow-inner border-[10px] border-[#e6d5b3]",
    font: "font-mono",

    // Photo
    headerLayout: "PHOTO_LEFT_STACKED_TEXT",
    renderHeaderPhoto: true,
    photoShape: "rounded-sm",
    photoSize: "w-36 h-36 object-cover ",
    photoBorder: "border-4 border-[#3e3a35] grayscale sepia-[0.8] contrast-125",

    // HEADER — zero top spacing
    headerContainer:
      "flex flex-row gap-3 items-center justify-start p-0 mb-1 border-b-2 border-double border-[#3e3a35]",

    name: "font-bold text-4xl mb-1 text-[#2c2925] uppercase tracking-tight",

    contactInfo: "flex flex-col text-xs gap-y-0 text-[#5c564d] justify-start",

    // Section titles (compact)
    sectionTitle:
      'text-sm font-bold uppercase text-[#2c2925] mb-1 border-b border-dashed border-[#8c8273] pb-[2px] before:content-[">"] before:mr-1',

    // Section content minimal spacing
    sectionContent: "text-[13px] leading-[1.5] text-[#4a453f] mb-1",

    jobTitle:
      "text-sm font-bold text-[#2c2925] underline decoration-1 underline-offset-2",

    companyName: "text-[13px] font-bold text-[#5c564d]",

    dateLocation:
      "text-[10px] font-bold text-[#7a7266] uppercase mt-[1px] mb-[2px]",
  },
};

export default RetroTypewriterTemplate;
