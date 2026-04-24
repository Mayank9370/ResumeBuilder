export default {
  id: "essence",
  name: "The Essence",
  family: "MINIMALIST",
  tags: ["Pure", "No-Frills", "Writer"],
  density: "High",
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
    className: `font-sans bg-[#fff0f5] text-black max-w-[210mm] mx-auto min-h-[297mm] shadow-lg`,
    style: {
      minHeight: "100%",
      backgroundColor: "#fff0f5", // Light pink background
      paddingTop: "0px", // Master switch for top edge
    },
    children: [
      // 1. Header
      {
        type: "STACK",
        className: `mb-0`, // Reduced header spacing
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
    backgroundColor: "#fff0f5",
    container: "bg-[#fff0f5] shadow-lg p-10",
    containerClass: "pt-0 px-8", // Template-level padding override
    header: "mb-0",
    name: "text-2xl font-bold mb-0",
    contactInfo: "text-sm text-gray-600 border-l-2 border-gray-200 pl-3 ml-1",
    sectionTitle: "text-sm font-bold uppercase text-gray-900 mt-0 mb-0", // Section space 0
    sectionContent: "text-sm leading-snug",
    jobTitle: "font-semibold",
    companyName: "text-gray-800",
    dateLocation: "text-gray-500 text-xs ml-2",
    bulletList: "list-none ml-0 space-y-1 pl-0",
  },
  differentiation: {
    layoutTopology: "LINEAR",
    density: "HIGH",
    typographyTone: "SANS_MODERN",
    visualWeight: "MINIMAL",
    featureDistinction:
      "Ultra-compact layout with left border contact info and no visual frills",
  },
  css: `
    .resume-template-essence {
      background-color: #fff0f5 !important;
    }
  `,
};
