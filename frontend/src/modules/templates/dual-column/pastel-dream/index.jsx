import React from "react";

// Pastel Dream - Soft, friendly, approachable layout
const PastelDreamTemplate = {
  id: "pastel-dream",
  name: "Pastel Dream",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop", // Temporary placeholder
  description:
    "Soft, friendly, and highly approachable with pastel colors and rounded edges.",
  layoutStrategy: "DUAL_COLUMN",

  columnWidths: { left: "40%", right: "55%" },
  columnGap: "5%",
  columnMap: {
    summary: "left",
    skills: "left",
    education: "right",
    languages: "left",
    experience: "right",
    projects: "right",
    certifications: "right",
  },

  styles: {
    container: "bg-[#faf5ff] text-gray-700 shadow-xl rounded-[3rem]", // Soft violet-tinted white
    font: "font-sans", // Opting for standard sans, but heavily rounded UI

    headerLayout: "PHOTO_LEFT_STACKED_TEXT",
    renderHeaderPhoto: true,
    photoShape: "rounded-[2rem]",
    photoSize: "w-36 h-36 mr-2",
    photoBorder: "border-8 border-white shadow-xl",

    headerContainer:
      "flex flex-col items-start bg-[#fdf4ff] rounded-t-[3rem] p-12 mb-8 border-b-2 border-pink-100",
    name: "font-extrabold text-5xl mb-3 text-fuchsia-900 tracking-tight mt-0",
    contactInfo:
      "flex flex-wrap text-sm gap-x-6 gap-y-2 text-fuchsia-500 justify-start font-medium",

    // Bubbly headers
    sectionTitle:
      "text-lg font-extrabold uppercase tracking-wide text-fuchsia-700 mb-6 bg-fuchsia-100/50 block w-max px-4 py-2 rounded-2xl mt-6",
    sectionContent: "text-[14px] leading-relaxed text-gray-600 font-medium",

    jobTitle: "text-xl font-bold text-gray-800",
    companyName: "text-md font-bold text-fuchsia-600",
    dateLocation: "text-xs font-bold text-gray-400 uppercase tracking-widest",
  },
};

export default PastelDreamTemplate;
