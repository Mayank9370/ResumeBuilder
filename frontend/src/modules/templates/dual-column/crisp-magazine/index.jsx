import React from "react";

// Crisp Magazine
const CrispMagazineTemplate = {
  id: "crisp-magazine",
  name: "Crisp Magazine",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop", // Temporary placeholder
  description:
    "High-end editorial feel with strict ruled lines separating sections.",
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
    container: "bg-white text-black border-x border-gray-200 shadow-sm",
    font: "font-serif", // Typographic focus

    renderHeaderPhoto: false, // Text dominant
    photoShape: "",
    photoSize: "",
    photoBorder: "",

    // Strict magazine header
    headerContainer:
      "flex flex-col items-center justify-center p-12 mb-8 border-y-4 border-black",
    name: "font-black text-6xl mb-4 text-black uppercase tracking-widest text-center",
    contactInfo:
      "flex flex-wrap text-sm gap-x-8 gap-y-2 text-gray-600 justify-center font-sans tracking-widest uppercase",

    // Ruled sections
    sectionTitle:
      "text-2xl font-black text-black mb-6 mt-8 border-t-2 border-black pt-2 uppercase tracking-tight",
    sectionContent: "text-[14px] leading-relaxed text-gray-800",

    jobTitle: "text-xl font-bold text-black font-sans uppercase",
    companyName: "text-[16px] italic text-gray-700",
    dateLocation:
      "text-[11px] font-sans font-bold text-gray-500 uppercase tracking-widest mt-1 mb-3",
  },
};

export default CrispMagazineTemplate;
