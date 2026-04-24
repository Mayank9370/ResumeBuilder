import React from "react";

// Studio Portrait - Gallery/editorial style with a tall portrait photo
const StudioPortraitTemplate = {
  id: "studio-portrait",
  name: "Studio Portrait",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop", // Temporary placeholder
  description:
    "Editorial gallery style featuring a dramatic tall portrait photo.",
  layoutStrategy: "DUAL_COLUMN",

  // Configuration for the dual column engine
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
    container: "bg-[#faf9f6] text-gray-900 shadow-md", // Off-white art paper feel
    font: "font-serif", // Serif for editorial feel

    // Dramatic portrait header
    renderHeaderPhoto: true,
    photoShape: "rounded-sm", // Harder edges like a framed photo
    photoSize: "w-32 h-40 object-cover shrink-0", // Adjusted for side-by-side
    photoBorder: "border-[6px] border-white shadow-2xl",

    // Float Layout to reliably pull image to the left and wrap name/profession around it on the right
    headerContainer:
      "flow-root pb-10 mb-8 border-b border-gray-300 relative [&>div:first-of-type]:!float-left [&>div:first-of-type]:!mr-8 [&>div:first-of-type]:!mb-4 [&>div:first-of-type]:!mt-1 [&>.text-center]:!text-left [&>.justify-center]:!justify-start",
    name: "font-normal text-6xl mb-1 text-gray-900 tracking-[0.15em] uppercase !text-left !mt-6",
    contactInfo:
      "flex flex-wrap text-xs gap-x-8 gap-y-2 text-gray-500 font-sans tracking-widest uppercase !justify-start !text-left",

    // Thin borders and sophisticated spacing
    sectionTitle:
      "text-sm font-semibold uppercase tracking-[0.3em] text-gray-400 mb-8 border-t border-gray-200 pt-4 mt-8",
    sectionContent: "text-[13.5px] leading-relaxed text-gray-700",

    // Italicized roles
    jobTitle: "text-xl font-normal text-gray-900 tracking-wide",
    companyName: "text-md italic text-gray-500",
    dateLocation: "text-xs font-sans text-gray-400 uppercase tracking-widest",
  },
};

export default StudioPortraitTemplate;
