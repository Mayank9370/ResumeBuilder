export default {
  id: "nordic",
  name: "The Nordic",
  family: "MINIMALIST",
  tags: ["Clean", "Open", "Light"],
  density: "Low",
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
    className: `font-sans bg-white text-gray-700 max-w-[210mm] mx-auto min-h-[297mm] shadow-lg`,
    style: {
      minHeight: "100%",
      backgroundColor: "white",
      paddingTop: "0px", // Master switch for top edge
    },
    children: [
      // 1. Header
      {
        type: "STACK",
        className: `mb-0 text-center border-b border-gray-200 pb-0`,
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
    header: "mb-0 text-center border-b border-gray-200 pb-0",
    name: "text-3xl font-light tracking-[0.2em] uppercase text-black mb-0",
    contactInfo:
      "text-xs mt-0 text-gray-400 tracking-widest flex justify-center gap-8",
    sectionTitle:
      "text-xs font-bold uppercase tracking-[0.25em] text-gray-400 text-center mt-0 mb-0 border-b border-gray-100 pb-0",
    sectionContent: "text-sm font-light leading-relaxed text-center",
    jobTitle: "font-normal text-base text-black",
    companyName: "text-gray-500",
    dateLocation: "block text-xs text-gray-300 italic mb-0",
    bulletList: "list-none space-y-1",
  },
  differentiation: {
    allowNearDuplicate: true,
    layoutTopology: "LINEAR",
    density: "MEDIUM",
    typographyTone: "SANS_MODERN",
    visualWeight: "MINIMAL",
    featureDistinction:
      "Center-aligned scandinavian design with subtle header/section borders for structured minimalism",
  },
};
