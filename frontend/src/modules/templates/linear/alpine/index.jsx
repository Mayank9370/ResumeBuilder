export default {
  id: "alpine",
  name: "The Alpine",
  family: "MINIMALIST",
  layoutStrategy: "COMPOSED",
  capabilities: {
    photo: false,
    layers: false,
    gutter: false,
    hybrid: false,
    geometric: false,
  },
  regions: {},
  tags: ["Swiss", "Grid", "Bold"],
  density: "Medium",
  formality: "Modern",
  layoutTree: {
    type: "STACK",
    className: `font-sans bg-white text-black max-w-[210mm] mx-auto min-h-[297mm] shadow-lg`, // Legacy container classes
    style: {
      minHeight: "100%",
      backgroundColor: "white", // Ensure background
      paddingTop: "0px", // Master switch for top edge
    },
    children: [
      // 1. Header
      {
        type: "STACK",
        className: `mb-0`, // Reduced header bottom spacing
        children: [
          {
            type: "ROW",
            style: {
              alignItems: "flex-end",
              gap: "0rem",
              justifyContent: "space-between",
            },
            children: [
              {
                type: "NAME_DISPLAY",
                style: { flex: 1 },
              },
              {
                type: "STACK",
                bind: "contact_list",
                hideTitle: true,
                style: {
                  textAlign: "right",
                  fontSize: "0.85rem",
                  alignSelf: "flex-end",
                },
              },
            ],
          },
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
    container:
      "font-sans bg-white text-black p-10 max-w-[210mm] mx-auto min-h-[297mm] shadow-lg",
    containerClass: "pt-0 px-10", // Template-level padding override
    header: "mb-0",
    name: "text-5xl font-bold tracking-tight mb-1",
    contactInfo: "text-sm font-bold border-t-4 border-black pt-2 block w-1/4",
    sectionTitle: "text-xl font-bold lowercase mt-0 mb-0", // Section space 0
    sectionContent: "text-sm leading-normal max-w-prose",
    jobTitle: "font-bold text-base",
    companyName: "text-gray-600",
    dateLocation: "block text-xs font-bold mt-0",
    bulletList: "list-none ml-0 space-y-1",
  },
  differentiation: {
    allowNearDuplicate: true,
    layoutTopology: "LINEAR",
    density: "MEDIUM",
    typographyTone: "SANS_MODERN",
    visualWeight: "HEAVY",
    featureDistinction:
      "Swiss-style bold typography with constrained contact width",
  },
};
