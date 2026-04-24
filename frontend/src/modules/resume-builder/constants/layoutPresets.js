
export const layoutPresets = [
    {
        id: 'single-column',
        name: 'Single Column',
        description: 'Standard professional layout. Best for ATS readability.',
        icon: 'Layout',
        config: {
            meta: { category: "Professional" },
            theme: {
                colors: { primary: "#000000", text: "#1f2937", background: "#ffffff" },
                fonts: { body: "Inter", heading: "Inter" }
            },
            layout: {
                type: 'grid',
                gridTemplateColumns: '1fr',
                regions: [
                    {
                        id: 'main',
                        sections: ['header', 'professional_summary', 'experience', 'education', 'skills'],
                        style: { padding: '2rem' }
                    }
                ]
            }
        }
    },
    {
        id: 'two-column',
        name: 'Two Column',
        description: 'Balanced 50/50 layout for creative professionals.',
        icon: 'Columns',
        config: {
            meta: { category: "Creative" },
            theme: {
                colors: { primary: "#3b82f6", text: "#1f2937", background: "#ffffff" },
                fonts: { body: "Inter", heading: "Inter" }
            },
            layout: {
                type: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1.5,
                regions: [
                    {
                        id: 'left',
                        sections: ['header', 'contact', 'skills', 'languages'],
                        style: { padding: '2rem', backgroundColor: '#f9fafb' }
                    },
                    {
                        id: 'right',
                        sections: ['professional_summary', 'experience', 'education', 'projects'],
                        style: { padding: '2rem' }
                    }
                ]
            }
        }
    },
    {
        id: 'header-focus',
        name: 'Header Focus',
        description: 'Prominent full-width header with single column body.',
        icon: 'PanelTop',
        config: {
            meta: { category: "Modern" },
            theme: {
                colors: { primary: "#ea580c", text: "#1f2937", background: "#ffffff" },
                fonts: { body: "Roboto", heading: "Roboto Slab" }
            },
            layout: {
                type: 'grid',
                gridTemplateColumns: '1fr',
                gridTemplateRows: 'auto 1fr',
                gridTemplateAreas: "'header' 'main'",
                regions: [
                    {
                        id: 'header',
                        sections: ['header'],
                        style: { gridArea: 'header', padding: '3rem', backgroundColor: '#1f2937', color: 'white', textAlign: 'center' }
                    },
                    {
                        id: 'main',
                        sections: ['professional_summary', 'experience', 'skills', 'education'],
                        style: { gridArea: 'main', padding: '2rem' }
                    }
                ]
            }
        }
    },
    {
        id: 'left-sidebar',
        name: 'Left Sidebar',
        description: 'Classic 30/70 split. Sidebar on the left.',
        icon: 'PanelLeft',
        config: {
            meta: { category: "Modern" },
            theme: {
                colors: { primary: "#0f766e", text: "#1f2937", background: "#ffffff" },
                fonts: { body: "Open Sans", heading: "Open Sans" }
            },
            layout: {
                type: 'grid',
                gridTemplateColumns: '30% 70%',
                regions: [
                    {
                        id: 'sidebar',
                        sections: ['contact', 'skills', 'education', 'social'],
                        style: { padding: '2rem', backgroundColor: '#f0fdfa' }
                    },
                    {
                        id: 'main',
                        sections: ['header', 'professional_summary', 'experience', 'projects'],
                        style: { padding: '2rem' }
                    }
                ]
            }
        }
    },
    {
        id: 'right-sidebar',
        name: 'Right Sidebar',
        description: 'Modern 70/30 split. Sidebar on the right.',
        icon: 'PanelRight',
        config: {
            meta: { category: "Professional" },
            theme: {
                colors: { primary: "#4338ca", text: "#1f2937", background: "#ffffff" },
                fonts: { body: "Merriweather", heading: "Merriweather" }
            },
            layout: {
                type: 'grid',
                gridTemplateColumns: '70% 30%',
                regions: [
                    {
                        id: 'main',
                        sections: ['header', 'professional_summary', 'experience', 'projects'],
                        style: { padding: '2rem' }
                    },
                    {
                        id: 'sidebar',
                        sections: ['contact', 'skills', 'education', 'certifications'],
                        style: { padding: '2rem', backgroundColor: '#eef2ff' }
                    }
                ]
            }
        }
    }
];

export const defaultSections = {
    header: {
        id: "header",
        type: "static",
        dataSource: "personal_info",
        title: "Header",
        showTitle: false,
        fields: {
            name: { type: "text", source: "full_name", style: { fontSize: "2rem", fontWeight: "bold" } },
            title: { type: "text", source: "profession", style: { fontSize: "1.25rem", color: "gray" } },
            phone: { type: "text", source: "phone", icon: "phone" },
            email: { type: "text", source: "email", icon: "mail" },
            location: { type: "text", source: "location", icon: "map-pin" },
            image: { type: "image", source: "image", style: { width: "100px", height: "100px", borderRadius: "50%" } }
        }
    },
    professional_summary: {
        id: "professional_summary",
        title: "Professional Summary",
        type: "text",
        dataSource: "professional_summary",
        style: { marginBottom: "1.5rem" },
        fields: {
            content: { type: "html", source: "professional_summary", style: { lineHeight: "1.6" } }
        }
    },
    experience: {
        id: "experience",
        title: "Experience",
        type: "list",
        dataSource: "experience",
        fields: {
            title: { type: "text", source: "title", style: { fontWeight: "bold" } },
            company: { type: "text", source: "company", style: { color: "primary", fontWeight: "600" } },
            date: { type: "date", source: "date", style: { fontStyle: "italic", color: "gray", fontSize: "0.9rem" } },
            location: { type: "text", source: "location", style: { color: "gray", fontSize: "0.9rem" } },
            description: { type: "html", source: "description", style: { marginTop: "0.5rem" } }
        }
    },
    education: {
        id: "education",
        title: "Education",
        type: "list",
        dataSource: "education",
        fields: {
            degree: { type: "text", source: "degree", style: { fontWeight: "bold" } },
            institution: { type: "text", source: "institution", style: { fontWeight: "500" } },
            date: { type: "date", source: "date", style: { color: "gray", fontSize: "0.9rem" } },
            gpa: { type: "text", source: "gpa", label: "GPA", style: { fontSize: "0.9rem" } }
        }
    },
    projects: {
        id: "projects",
        title: "Projects",
        type: "list",
        dataSource: "projects", // Assuming projects dataSource exists
        fields: {
            title: { type: "text", source: "title", style: { fontWeight: "bold" } },
            link: { type: "link", source: "link", style: { color: "blue", textDecoration: "underline", fontSize: "0.9rem" } },
            description: { type: "html", source: "description" }
        }
    },
    skills: {
        id: "skills",
        title: "Skills",
        type: "tags",
        dataSource: "skills",
        fields: {
            item: { type: "text", value: "Skill Item", style: { backgroundColor: "#f3f4f6", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.9rem" } }
        }
    },
    languages: {
        id: "languages",
        title: "Languages",
        type: "list",
        dataSource: "languages",
        fields: {
            language: { type: "text", source: "language", style: { fontWeight: "600" } },
            proficiency: { type: "text", source: "proficiency", style: { color: "gray", fontSize: "0.9rem" } }
        }
    },
    contact: {
        id: "contact",
        title: "Contact",
        type: "static",
        dataSource: "personal_info",
        fields: {
            email: { type: "text", source: "email", icon: "mail", style: { display: "flex", gap: "0.5rem" } },
            phone: { type: "text", source: "phone", icon: "phone", style: { display: "flex", gap: "0.5rem" } },
            location: { type: "text", source: "location", icon: "map-pin", style: { display: "flex", gap: "0.5rem" } },
            linkedin: { type: "link", source: "socialLinks.0.url", icon: "linkedin", label: "LinkedIn" }
        }
    }
};
