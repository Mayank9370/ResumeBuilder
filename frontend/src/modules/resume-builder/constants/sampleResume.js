
export const sampleResume = {
    title: "Senior Project Manager Resume",
    personal_info: {
        full_name: "Alex J. Taylor", // FIXED: Matches PersonalInfoForm
        profession: "Senior Project Manager", // FIXED: Matches PersonalInfoForm
        email: "alex.taylor@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA, USA", // FIXED: Concatenated

        // Legacy fields for backward compat if any renderer uses them
        firstName: "Alex",
        lastName: "Taylor",
        city: "San Francisco",
        state: "CA",
        country: "USA",

        // Social Links (New Structure)
        socialLinks: [
            { id: 1, platform: "LinkedIn", url: "linkedin.com/in/alextaylor" },
            { id: 2, platform: "Portfolio", url: "alextaylor.pm" }
        ],
        // Legacy Social (for ResumePreview migration logic to catch)
        linkedin: "linkedin.com/in/alextaylor",
        portfolio: "alextaylor.pm",

        jobTitle: "Senior Project Manager", // Legacy
        summary: "Results-oriented Senior Project Manager with 7+ years of experience leading cross-functional teams..."
    },
    sections_obj: {
        experience: [
            {
                id: "exp1",
                role: "Senior Project Manager",
                company: "TechFlow Solutions",
                location: "San Francisco, CA",
                start_date: "2020", // Matches particle expects start_date
                end_date: "Present",
                description: [ // Array for bullets
                    "Lead a team of 15 developers and designers in the delivery of a enterprise-grade SaaS platform, serving 50k+ active users.",
                    "Implemented Agile/Scrum methodologies, resulting in 20% increase in sprint velocity and 15% reduction in defects.",
                    "Manage project budgets totaling $2M annually, consistently delivering within 5% variance.",
                    "Facilitate cross-departmental collaboration between engineering, product, and marketing."
                ]
            },
            {
                id: "exp2",
                role: "Project Coordinator",
                company: "Creative Pulse Agency",
                location: "Austin, TX",
                start_date: "2017",
                end_date: "2020",
                description: [
                    "Coordinated timelines and deliverables for 20+ concurrent digital marketing campaigns for Fortune 500 clients.",
                    "Served as primary client liaison, maintaining a 98% client satisfaction rating.",
                    "Streamlined internal asset management processes, reducing file retrieval time by 40%."
                ]
            }
        ],
        education: [
            {
                id: "edu1",
                degree: "Master of Business Administration (MBA)",
                institution: "State University", // Matches edu_item
                location: "San Francisco, CA",
                graduation_date: "2020",
                details: "Focus on Technology Management. Graduated with Honors (3.9 GPA)."
            },
            {
                id: "edu2",
                degree: "B.A. Business Administration",
                institution: "City College",
                location: "Austin, TX",
                graduation_date: "2017"
            }
        ],
        skills: {
            items: [
                "Agile & Scrum", "Jira & Confluence", "Risk Management",
                "Stakeholder Communication", "Budgeting",
                "Strategic Planning", "React (Basic)", "SQL", "Go-to-Market"
            ]
        },
        languages: [
            { id: "lang1", name: "English", level: "Native" },
            { id: "lang2", name: "Spanish", level: "Professional" }
        ],
        certifications: [
            {
                id: "cert1",
                name: "Project Management Professional (PMP)",
                issuer: "PMI",
                date: "2019"
            },
            {
                id: "cert2",
                name: "Certified Scrum Master (CSM)",
                issuer: "Scrum Alliance",
                date: "2018"
            }
        ]
    },
    section_order: [
        "experience",
        "education",
        "skills",
        "certifications",
        "languages"
    ],
    // Default Styling
    formatting: {
        spacing_scale: 1.0,
        section_spacing: 1.0,
        paragraph_spacing: 0.5,
        header_spacing: 1.0, // Ensure header spacing
        heading_scale: 1.0,
        subheading_scale: 1.0,
        font_family: 'Inter',
        accent_color: '#2563EB'
    }
};
