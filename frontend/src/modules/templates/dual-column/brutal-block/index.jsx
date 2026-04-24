import React from "react";

// Brutal Block - Brutalist, thick borders, sharp edges
const BrutalBlockTemplate = {
  id: "brutal-block",
  name: "Brutal Block",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop", // Temporary placeholder
  description:
    "Unapologetic brutalist design featuring thick borders and high contrast.",
  layoutStrategy: "DUAL_COLUMN",

  columnWidths: { left: "30%", right: "65%" },
  columnGap: "5%",
  columnMap: {
    education: "left",
    skills: "left",
    languages: "left",
    certifications: "left",
    summary: "right",
    experience: "right",
    projects: "right",
  },

  styles: {
    container: "bg-white text-black",
    font: "font-sans",

    headerLayout: "PHOTO_LEFT_STACKED_TEXT",
    renderHeaderPhoto: true,
    photoShape: "rounded-none",
    photoSize: "w-40 h-40 object-cover grayscale",
    photoBorder: "border-4 border-black",

    headerContainer:
      "flex flex-col items-start p-10 mb-10 border-b-8 border-black",

    name: "font-black text-6xl mb-1 text-black uppercase tracking-tighter shadow-black ",

    jobTitle: "text-xl font-black text-black uppercase",

    contactInfo:
      "flex flex-row flex-wrap text-sm gap-x-4 mt-2 text-black font-black uppercase tracking-widest",

    sectionTitle:
      "text-2xl font-black uppercase text-black border-y-4 border-black py-2",
    sectionContent: "text-[15px] leading-snug text-black font-bold",

    jobTitleEntry: "text-xl font-black text-black uppercase",
    companyName: "text-lg font-black text-white bg-black px-2 inline-block",
    dateLocation:
      "text-sm font-black text-black uppercase tracking-widest mt-2",
  },
};

export default BrutalBlockTemplate;
