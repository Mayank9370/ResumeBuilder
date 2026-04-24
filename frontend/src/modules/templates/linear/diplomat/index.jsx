export default {
  id: "diplomat",
  name: "The Diplomat",
  family: "AUTHORITY",
  layoutStrategy: "COMPOSED",
  capabilities: {
    photo: false,
    layers: false,
    gutter: false,
    hybrid: false,
    geometric: false,
  },
  regions: {},
  tags: ["Elegant", "Soft", "International"],
  density: "Medium",
  formality: "Formal",
  docx: { supported: "FULL" },
  layoutTree: {
    type: "STACK",
    className: `font-serif bg-white text-gray-900 max-w-[210mm] mx-auto min-h-[297mm] shadow-lg border-t-4 border-gray-300`, // Legacy container classes
    style: {
      minHeight: "100%",
      backgroundColor: "white", // Ensure background
      paddingTop: "0px", // Master switch for top edge
    },
    children: [
      // 1. Header
      {
        type: "STACK",
        className: `text-center mb-0 border-b border-gray-200 pb-0`, // Reduced spacing
        children: [
          {
            type: "NAME_DISPLAY",
            style: {
              // We let ParticleRenderer handle the font style via styles.name
            },
          },
          { type: "STACK", bind: "contact_list", style: { marginTop: "2px" } },
        ],
      },

      // 2. Summary
      { type: "STACK", bind: "summary", title: "Professional Summary" },

      // 3. Core Sections
      { type: "STACK", bind: "experience", title: "Experience" },
      { type: "STACK", bind: "education", title: "Education" },
      { type: "STACK", bind: "skills", title: "Skills" },
      { type: "STACK", bind: "projects", title: "Projects" },
      { type: "STACK", bind: "custom_sections" },
    ],
  },

  styles: {
    containerClass: "pt-0 px-1", // Template-level padding override
    header: "text-center mb-0 border-b border-gray-200 pb-0",
    name: "text-4xl font-normal tracking-wide text-gray-800 mb-0",
    contactInfo: "text-sm mt-0 text-gray-500 italic",
    sectionTitle:
      "text-lg font-bold text-center border-b border-gray-200 mt-0 mb-0 pb-0 uppercase tracking-widest text-gray-700", // Section space 0
    sectionContent: "text-sm leading-relaxed text-justify",
    jobTitle: "font-bold text-base",
    companyName: "italic",
    dateLocation: "float-right text-sm italic text-gray-500",
    bulletList: "list-disc ml-5 space-y-1",
  },
  differentiation: {
    allowNearDuplicate: true,
    layoutTopology: "LINEAR",
    density: "MEDIUM",
    typographyTone: "SERIF_AUTHORITY",
    visualWeight: "BALANCED",
    featureDistinction:
      "Elegant gray top border with centered italic sections for international/diplomatic roles",
  },
};
