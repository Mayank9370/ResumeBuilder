export default {
  id: "presidio",
  name: "The Presidio",
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
  tags: ["Gov", "Block", "Grey"],
  density: "High",
  formality: "Formal",
  layoutTree: {
    type: "STACK",
    className: `font-sans bg-white text-black max-w-[210mm] mx-auto min-h-[297mm] shadow-lg`,
    style: {
      minHeight: "100%",
      backgroundColor: "white", // Ensure background
      paddingTop: "0px", // Master switch for top edge
    },
    children: [
      // 1. Header
      {
        type: "STACK",
        className: `mb-0 bg-gray-100 p-6 -mx-0 -mt-0 border-b border-gray-300`, // Reduced spacing
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
    containerClass: "pt-0 px-10", // Template-level padding override
    header: "mb-0 bg-gray-100 p-6 -mx-0 -mt-0 border-b border-gray-300",
    name: "text-3xl font-bold uppercase mb-0",
    contactInfo: "text-xs font-bold text-gray-500 mt-0",
    sectionTitle:
      "text-sm font-bold uppercase bg-gray-200 px-2 py-0 mt-0 mb-0 text-gray-700", // Section space 0
    sectionContent: "text-xs leading-normal",
    jobTitle: "font-bold text-sm",
    companyName: "text-gray-600",
    dateLocation: "float-right text-xs font-bold text-gray-400",
    bulletList: "list-disc ml-4 space-y-0.5",
  },
  differentiation: {
    layoutTopology: "HEADER_BANNER",
    density: "HIGH",
    typographyTone: "SANS_MODERN",
    visualWeight: "HEAVY",
    featureDistinction:
      "Gray background header box with shaded section labels for government/civic roles",
  },
};
