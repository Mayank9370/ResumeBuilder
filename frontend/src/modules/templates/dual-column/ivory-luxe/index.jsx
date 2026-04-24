import React from "react";

// Ivory Luxe — Luxury editorial with gold accents and serif typography
// Light ivory background with champagne/gold details and elegant spacing
const IvoryLuxeTemplate = {
  id: "ivory-luxe",
  name: "Ivory Luxe",
  preview:
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop",
  description:
    "An upscale, editorial design featuring gold accents and refined serif typography — perfect for executive and luxury brand roles.",
  layoutStrategy: "DUAL_COLUMN",

  columnWidths: { left: "35%", right: "60%" },
  columnGap: "5%",
  columnMap: {
    skills: "left",
    education: "left",
    languages: "left",
    certifications: "left",
    summary: "right",
    experience: "right",
    projects: "right",
  },

  photoColumn: "left",

  styles: {
    container: "bg-[#FFFDF7] text-[#2C2418] shadow-lg relative",
    font: "font-serif",

    // Warm ivory left panel
    __global:
      'before:content-[""] before:absolute before:inset-y-0 before:left-0 before:w-[37%] before:bg-gradient-to-b before:from-[#F5EFE0] before:to-[#EDE4D3] before:z-0 before:border-r before:border-[#D4C5A9]',

    // Photo — elegant circular frame
    renderHeaderPhoto: true,
    photoShape: "rounded-full z-20 shrink-0",
    photoSize: "w-28 h-28 mx-auto mb-2",
    photoBorder: "border-[4px] border-[#C9A96E] shadow-lg",

    standalonePhotoContainer:
      "flex justify-center items-start w-full pt-4 relative z-10",

    // Header (Right Column)
    headerContainer:
      "flex flex-col items-start py-2 pr-10 relative z-10 min-h-[100px] justify-center",

    name: "font-bold text-4xl mb-1 text-[#2C2418] tracking-tight leading-tight",

    contactInfo:
      "flex flex-wrap items-center text-sm gap-x-5 gap-y-1 text-[#8B7355] font-medium justify-start w-full mt-1",

    // Elegant gold underline sections
    sectionTitle:
      "text-xs font-bold uppercase tracking-[0.25em] text-[#8B6914] mb-4 mt-5 pb-1.5 border-b border-[#C9A96E]/40 relative z-10",

    sectionContent:
      "text-[13.5px] leading-[1.75] text-[#4A3C2A] relative z-10",

    jobTitle: "text-[16px] font-bold text-[#2C2418]",
    companyName: "text-[14px] font-semibold text-[#8B6914] italic",
    dateLocation: "text-xs text-[#A0896C] uppercase tracking-widest",
  },
};

export default IvoryLuxeTemplate;
