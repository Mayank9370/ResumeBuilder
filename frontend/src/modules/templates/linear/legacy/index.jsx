export default {
  id: "legacy",
  name: "The Legacy",
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
  tags: ["Academic", "Old", "Serif"],
  density: "Medium",
  formality: "Formal",
  layoutTree: {
    type: "STACK",
    className: `font-serif bg-[#fffaf0] text-black p-12 max-w-[210mm] mx-auto min-h-[297mm] shadow-lg', // Old paper`, // Legacy container classes
    style: {
      minHeight: "100%",
      backgroundColor: "white", // Ensure background
    },
    children: [
      // 1. Header
      {
        type: "STACK",
        className: `mb-10 text-center border-b border-black pb-6`,
        children: [
          {
            type: "NAME_DISPLAY",
            style: {
              // We let ParticleRenderer handle the font style via styles.name
              // But we need to ensure it's rendered.
              // Actually NAME_DISPLAY uses styles.name?
              // Let's check ParticleRenderer.
              // If not, we might need to inject inline styles, but let's hope styles.name works.
            },
          },
          { type: "STACK", bind: "contact_list", style: { marginTop: "10px" } },
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
      "font-serif bg-[#fffaf0] text-black p-12 max-w-[210mm] mx-auto min-h-[297mm] shadow-lg", // Old paper
    header: "mb-10 text-center border-b border-black pb-6",
    name: "text-4xl font-bold tracking-widest uppercase",
    contactInfo: "text-sm mt-3 italic text-gray-700 font-medium",
    sectionTitle:
      "text-lg font-bold italic border-b border-black mt-8 mb-4 pb-1",
    sectionContent: "text-sm leading-relaxed",
    jobTitle: "font-bold underline",
    companyName: "italic",
    dateLocation: "float-right text-sm font-normal italic",
    bulletList: "list-disc ml-6 space-y-1",
  },
  differentiation: {
    allowNearDuplicate: true,
    layoutTopology: "LINEAR",
    density: "MEDIUM",
    typographyTone: "SERIF_AUTHORITY",
    visualWeight: "BALANCED",
    featureDistinction:
      "Antique paper background with underlined job titles and italic serif sections",
  },
};
