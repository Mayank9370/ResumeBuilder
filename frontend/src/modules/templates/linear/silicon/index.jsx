export default {
  id: "silicon",
  name: "The Silicon",
  family: "INNOVATOR",
  tags: ["Tech", "Modern", "Blue"],
  density: "Medium",
  formality: "Modern",
  layoutStrategy: "COMPOSED",
  capabilities: {
    photo: false,
    layers: false,
    gutter: false,
    hybrid: false,
    geometric: false,
  },
  docx: { supported: "FULL" },
  regions: {},
  layoutTree: {
    type: "STACK",
    className: `font-sans bg-white text-gray-800 max-w-[210mm] mx-auto min-h-[297mm] shadow-lg`,
    style: {
      minHeight: "100%",
      backgroundColor: "white",
      paddingTop: "0px", // Master switch for top edge
    },
    children: [
      // 1. Header
      {
        type: "STACK",
        className: `mb-0 pb-0 border-b border-blue-100`, // Reduced spacing
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
    header: "mb-0 pb-0 border-b border-blue-100",
    name: "text-5xl font-extrabold tracking-tight text-blue-600 mb-0",
    contactInfo: "text-sm mt-0 text-gray-500 font-medium flex gap-6",
    sectionTitle:
      "text-lg font-bold text-blue-500 mt-0 mb-0 uppercase tracking-wide", // Section space 0
    sectionContent: "text-sm leading-relaxed",
    jobTitle: "font-bold text-lg text-gray-900",
    companyName: "text-blue-500 font-medium",
    dateLocation: "float-right text-sm text-gray-400 mb-0",
    bulletList: "list-none space-y-1 ml-0 pl-0",
  },
  differentiation: {
    allowNearDuplicate: true,
    layoutTopology: "LINEAR",
    density: "MEDIUM",
    typographyTone: "SANS_MODERN",
    visualWeight: "BALANCED",
    featureDistinction:
      "Tech startup aesthetic with blue-600 accent and no bullet markers",
  },
};
