import React from "react";

// Creative Director - High contrast, bold colors, massive circular photo
const CreativeDirectorTemplate = {
  id: "creative-director",
  name: "Creative Director",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop",
  description:
    "High contrast, bold layout with a massive circular profile picture.",
  layoutStrategy: "DUAL_COLUMN",

  columnWidths: { left: "60%", right: "35%" },
  columnGap: "5%",
  columnMap: {
    summary: "left",
    experience: "left",
    projects: "left",
    skills: "right",
    education: "right",
    certifications: "right",
    languages: "right",
  },

  styles: {
    containerClass: "pt-0 px-12",
    container: "bg-[#FFDE00] text-black shadow-2xl",
    font: "font-sans",

    // Massive Photo Header
    renderHeaderPhoto: true,
    photoShape: "rounded-full",
    photoSize: "w-48 h-48",
    photoBorder: "border-[8px] border-black shadow-none",

    headerContainer:
      "flex flex-col items-start p-4 pr-[250px] min-h-[260px] justify-center mb-0 border-b-[10px] border-black pt-0 pb-0 relative [&_.photo-container]:absolute [&_.photo-container]:right-12 [&_.photo-container]:top-1/2 [&_.photo-container]:-translate-y-1/2 [&_.photo-container]:m-0",

    name: "font-black text-6xl md:text-7xl mb-0 text-black tracking-tight uppercase",

    contactInfo:
      "flex flex-wrap text-sm gap-x-6 gap-y-2 text-black justify-start font-bold uppercase tracking-wide mt-4",

    // Updated Section Titles (better for yellow background)
    sectionTitle:
      "text-2xl font-black uppercase text-black mb-2 mt-6 border-b-4 border-black inline-block pb-1 tracking-wide",

    sectionContent: "text-[15px] leading-snug text-black font-medium mt-2",

    // Entries
    jobTitle: "text-xl font-black text-black uppercase",

    companyName:
      "text-lg font-bold text-black border-b-2 border-black inline-block",

    dateLocation:
      "text-sm font-bold text-black uppercase tracking-wide mt-1 mb-1",
  },
};

export default CreativeDirectorTemplate;
