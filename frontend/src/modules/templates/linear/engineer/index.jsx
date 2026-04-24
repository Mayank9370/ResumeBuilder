export default {
  id: "engineer_compact",
  name: "Engineer Compact",
  family: "SPECIALIST",
  tags: ["Dense", "Technical", "Compact"],
  density: "Ultra",
  formality: "Formal",
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
    className:
      "font-sans bg-white text-black max-w-[210mm] mx-auto min-h-[297mm]",
    style: {
      paddingTop: "6px",
      paddingLeft: "24px",
      paddingRight: "24px",
    },

    children: [
      // HEADER
      {
        type: "STACK",
        className: "text-center border-b border-gray-400 pb-1 mb-1",
        children: [
          { type: "NAME_DISPLAY" },
          { type: "STACK", bind: "contact_list" },
        ],
      },

      // SUMMARY
      { type: "STACK", bind: "summary", title: "Summary" },

      // SKILLS
      { type: "STACK", bind: "skills", title: "Skills" },

      // PROJECTS
      { type: "STACK", bind: "projects", title: "Projects" },

      // EDUCATION
      { type: "STACK", bind: "education", title: "Education" },

      // CERTIFICATIONS
      { type: "STACK", bind: "custom_sections" },
    ],
  },

  styles: {
    containerClass: "px-6",

    headerVariant: "compact",
    headerAlign: "center",

    name: "text-[14px] font-bold text-center leading-tight",

    contactInfo: "text-[11px] text-center leading-tight",

    sectionTitle:
      "text-[11px] font-bold text-center border-t border-b border-gray-400 py-[1px] mt-[2px] mb-[2px]",

    sectionContent: "text-[11px] leading-tight",

    jobTitle: "font-bold text-[11px]",

    companyName: "font-semibold",

    dateLocation: "float-right text-[10px]",

    bulletList: "list-disc ml-4 space-y-[1px] text-[11px]",
  },
  differentiation: {
    allowNearDuplicate: true,
    layoutTopology: "LINEAR",
    density: "ULTRA_HIGH",
    typographyTone: "MINIMAL_TECHNICAL",
    visualWeight: "LIGHT",
    featureDistinction:
      "Ultra dense engineering resume layout with centered section headers and minimal spacing",
  },
};
