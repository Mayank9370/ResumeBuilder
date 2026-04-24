export default {
  id: "fellow",
  name: "The Fellow",
  family: "SPECIALIST",
  layoutStrategy: "COMPOSED",
  capabilities: {
    photo: false,
    layers: false,
    gutter: false,
    hybrid: false,
    geometric: false,
  },
  regions: {},
  tags: ["Academic", "CV", "Dense"],
  density: "High",
  formality: "Formal",
  layoutTree: {
    type: "STACK",
    className: `font-serif bg-pink-50 text-black max-w-[210mm] mx-auto min-h-[297mm] shadow-lg text-sm`,
    style: {
      minHeight: "100%",
      backgroundColor: "#eecbd5ff",
      paddingTop: "0px", // Master switch for top edge
    },
    children: [
      // 1. Header
      {
        type: "STACK",
        className: `mb-0 pb-0 border-b border-gray-300`, // Zero spacing
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
    containerClass: "pt-0 px-6", // Template-level padding override
    header: "mb-0 pb-0 border-b border-gray-300",
    name: "text-xl font-bold uppercase mb-0",
    contactInfo: "text-xs mt-0 text-gray-600",
    sectionTitle: "text-sm font-bold uppercase mt-0 mb-0 text-gray-700", // Section space 0
    sectionContent: "text-xs leading-snug",
    jobTitle: "font-bold italic",
    companyName: "font-normal",
    dateLocation: "float-right text-xs",
    bulletList: "list-disc ml-4 space-y-0.5",
  },
  differentiation: {
    allowNearDuplicate: true,
    layoutTopology: "LINEAR",
    density: "HIGH",
    typographyTone: "SERIF_AUTHORITY",
    visualWeight: "MINIMAL",
    featureDistinction:
      "Academic CV format with ultra-compact serif text and italic job titles",
  },
};
