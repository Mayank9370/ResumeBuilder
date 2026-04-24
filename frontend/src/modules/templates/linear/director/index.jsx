export default {
  id: "director",
  name: "The Director",
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
  tags: ["Executive", "Modern", "Sharp"],
  density: "Medium",
  formality: "Formal",
  layoutTree: {
    type: "STACK",
    className: `font-serif bg-white text-gray-800 mb-0 max-w-[210mm] mx-auto min-h-[297mm] shadow-lg`,
    style: {
      minHeight: "100%",
      backgroundColor: "white",
      paddingTop: "0px", // Disable engine safety padding and set to 0
    },
    children: [
      {
        type: "STACK",
        className: `text-left mt-0`,
        children: [
          {
            type: "NAME_DISPLAY",
            style: {},
          },
          { type: "STACK", bind: "contact_list" },
        ],
      },
      { type: "STACK", bind: "summary", title: "Professional Summary" },
      { type: "STACK", bind: "experience", title: "Experience" },
      { type: "STACK", bind: "education", title: "Education" },
      { type: "STACK", bind: "skills", title: "Skills" },
      { type: "STACK", bind: "projects", title: "Projects" },
      { type: "STACK", bind: "custom_sections" },
    ],
  },

  styles: {
    containerClass: "pt-0 px-12", // Apply template-level padding override
    header: "text-left",
    name: "text-xl font-normal italic tracking-tight",
    contactInfo: "text-sm mt-0 text-gray-500 font-sans",
    sectionTitle:
      "text-xl font-normal italic text-gray-300 border-l-4 border-gray-800 pl-4",
    sectionContent: "text-sm leading-relaxed font-sans",
    jobTitle: "font-bold text-lg",
    companyName: "font-medium text-gray-600",
    dateLocation: "float-right text-xs text-gray-400 font-serif",
    bulletList: "list-square ml-5 space-y-2",
  },
  differentiation: {
    layoutTopology: "LINEAR",
    density: "MEDIUM",
    typographyTone: "HYBRID_CONTRAST",
    visualWeight: "BALANCED",
    featureDistinction:
      "Oversized italic name with left-border italic sections for film director aesthetic",
  },
};
