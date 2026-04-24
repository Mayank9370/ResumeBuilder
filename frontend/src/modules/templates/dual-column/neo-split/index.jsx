import React from "react";

// Neo Split - High contrast 50/50 split layout
const NeoSplitTemplate = {
  id: "neo-split",
  name: "Neo Split",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop", // Temporary placeholder
  description: "A stark, high-contrast 50/50 layout with a dark mode header.",
  layoutStrategy: "DUAL_COLUMN",

  // Configuration for the dual column engine
  columnWidths: { left: "48%", right: "48%" },
  columnGap: "4%",
  columnMap: {
    summary: "right",
    experience: "right",
    projects: "right",
    skills: "right",
    technical_skills: "right",
    education: "right",
    certifications: "right",
    languages: "right",
  },

  styles: {
    containerClass: "pt-0 px-12", // Zero spacing master switch
    container: "bg-white text-gray-900 shadow-2xl",
    font: "font-sans",

    // Header (Black background removed)
    headerContainer: "p-10 mb-0 rounded-b-xl border-none pt-0 pb-0",
    name: "font-black text-5xl mb-0 tracking-tighter text-gray-900 mt-0",
    contactInfo:
      "flex flex-wrap text-sm gap-x-6 gap-y-2 text-gray-500 justify-center opacity-90 mt-0",

    // Stark typography (Spacing reduced to 0)
    sectionTitle:
      'text-2xl font-black uppercase tracking-tight text-gray-900 mb-0 relative inline-block after:content-[""] after:block after:w-1/2 after:h-1.5 after:bg-gray-900 after:mt-0 mt-0',
    sectionContent: "text-sm leading-relaxed text-gray-700",

    jobTitle: "text-xl font-bold text-gray-900",
    companyName: "text-md font-bold text-gray-500",
    dateLocation:
      "text-xs font-bold text-gray-400 uppercase tracking-wider mb-0",
  },
};

export default NeoSplitTemplate;
