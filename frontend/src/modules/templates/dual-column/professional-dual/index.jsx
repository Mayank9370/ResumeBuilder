/**
 * Professional Dual Template
 *
 * A professional two-column resume layout using the DualColumnLayoutStrategy.
 * Left column (55%): Summary, Projects, Experience
 * Right column (45%): Skills, Education, Languages, Custom Sections
 *
 * Slightly more balanced column widths. Clean, professional typography.
 * No decorations, no backgrounds, no graphics.
 */
export default {
  id: "professional-dual",
  name: "Professional Dual",
  family: "PROFESSIONAL",
  layoutStrategy: "DUAL_COLUMN",
  capabilities: {
    photo: false,
    geometric: false,
  },
  docx: { supported: "PARTIAL" },

  // Column configuration for DualColumnLayoutStrategy
  columnMap: {
    summary: "right",
    professional_summary: "right",
    projects: "right",
    experience: "left",
    skills: "right",
    technical_skills: "right",
    education: "right",
    languages: "right",
    certifications: "right",
    awards: "right",
    volunteer: "right",
    interests: "right",
  },

  columnWidths: {
    left: "55%",
    right: "45%",
  },

  columnGap: "24px",

  styles: {
    container: "bg-white shadow-2xl",
    containerClass: "font-serif text-gray-800",

    // Section Titles
    sectionTitle:
      "text-sm font-bold uppercase tracking-widest text-gray-600 mb-3 pb-1 border-b-2 border-gray-300",

    // Items
    jobTitle: "font-bold text-base text-gray-900",
    companyName: "text-gray-500 font-normal",
    dateLocation: "text-xs text-gray-400 block mb-1",
    sectionContent: "text-sm leading-relaxed text-gray-700",

    // Bullets
    bulletList: "ml-4 space-y-1 list-disc text-sm text-gray-700",
  },
};
