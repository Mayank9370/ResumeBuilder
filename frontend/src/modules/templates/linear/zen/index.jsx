export default {
  id: "academic_compact",
  name: "Academic Compact",
  family: "CLASSIC",

  layoutStrategy: "COMPOSED",

  capabilities: {
    photo: false,
    layers: false,
    gutter: false,
    hybrid: false,
    geometric: false,
  },

  tags: ["ATS", "Compact", "Academic"],

  density: "Ultra-High",
  formality: "Formal",

  layoutTree: {
    type: "STACK",

    className: `
      font-sans
      text-gray-800
      bg-white
      max-w-[210mm]
      mx-auto
      min-h-[297mm]
      px-8
      pt-2
      text-[12px]
      leading-[1.15]
    `,

    children: [
      {
        type: "STACK",
        className: "pb-1",
        children: [
          {
            type: "NAME_DISPLAY",
          },
          {
            type: "STACK",
            bind: "contact_list",
            className: "mt-0 text-[12px]",
          },
        ],
      },

      {
        type: "STACK",
        bind: "summary",
        title: "Summary",
      },

      {
        type: "STACK",
        bind: "skills",
        title: "Skills",
      },

      {
        type: "STACK",
        bind: "projects",
        title: "Projects",
      },

      {
        type: "STACK",
        bind: "education",
        title: "Education",
      },

      {
        type: "STACK",
        bind: "certificates",
        title: "Certificate",
      },

      {
        type: "STACK",
        bind: "custom_sections",
      },
    ],
  },

  styles: {
    containerClass: "px-8 pt-2",

    headerVariant: "compact",
    header: "pb-1 mb-1 border-b border-gray-300",

    name: "text-[16px] font-bold text-gray-900 mb-0",

    contactInfo: "text-[11px] text-gray-700 leading-none",

    sectionTitle: `
      text-[12px]
      font-bold
      uppercase
      text-gray-900
      mt-1
      mb-0.5
      border-b
      border-gray-200
      pb-[2px]
    `,

    // Increased paragraph text by ~1px
    sectionContent: "text-[13px] leading-[1.2] mb-0.5",

    jobTitle: "font-semibold text-[11.5px] text-gray-900",

    companyName: "text-[11px] font-medium text-gray-800",

    dateLocation: "text-[10px] text-gray-600 uppercase font-semibold",

    bulletList: "list-disc ml-4 space-y-0 mt-0.5",
  },

  differentiation: {
    layoutTopology: "LINEAR",
    density: "ULTRA_COMPACT",
    typographyTone: "ACADEMIC",
    visualWeight: "MINIMAL",
    featureDistinction:
      "ATS-friendly compact academic layout with ultra-dense typography and minimal spacing.",
  },
};
