import React from "react";

// Dev Console
const DevConsoleTemplate = {
  id: "dev-console",
  name: "Dev Console",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop", // Temporary placeholder
  description: "A clean, daytime-friendly code editor aesthetic.",
  layoutStrategy: "DUAL_COLUMN",

  columnWidths: { left: "40%", right: "55%" },
  columnGap: "5%",
  columnMap: {
    experience: "right",
    projects: "left",
    summary: "right",
    skills: "right",
    technical_skills: "right",
    education: "right",
    languages: "right",
  },

  styles: {
    // Solarized light or Github light theme vibe
    container:
      "bg-[#F3F4F6] text-[#24292F] shadow-sm rounded-lg border border-[#D0D7DE]",
    font: "font-mono text-[13.5px]", // IDE font

    renderHeaderPhoto: false,

    headerContainer:
      "flex flex-col items-start p-8 mb-6 bg-[#F6F8FA] border-b border-[#D0D7DE] object-top",
    name: "font-bold text-3xl mb-3 text-[#0969DA] tracking-tight",
    contactInfo: "flex flex-wrap text-xs gap-x-5 gap-y-2 text-[#57606A]",

    // Syntax highlighted headers
    sectionTitle:
      'text-md font-bold text-[#0550AE] mb-5 mt-8 flex items-center before:content-["const_"] before:text-[#CF222E] after:content-["_=_()_=>_{"] after:text-[#24292F] after:ml-2',
    sectionContent:
      "text-[13px] leading-[1.6] text-[#24292F] pl-4 border-l border-[#D0D7DE]",

    jobTitle: "text-[15px] font-bold text-[#111111]",
    companyName: "text-[14px] font-medium text-[#0969DA]",
    dateLocation: "text-[11px] text-[#57606A] uppercase tracking-wider",
  },
};

export default DevConsoleTemplate;
