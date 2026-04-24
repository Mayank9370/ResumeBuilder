/**
 * Comprehensive Female Sample Resume - 90% Field Coverage
 * Used for generating realistic template previews
 */

export const femaleSampleResume = {
    title: "Senior Product Manager Resume",
    personal_info: {
        full_name: "Sarah Martinez",
        profession: "Senior Product Manager",
        email: "sarah.martinez@email.com",
        phone: "+1 (650) 234-8901",
        location: "Palo Alto, CA",
        
        // Photo placeholder - script will inject actual image
        image: null,
        photo: null,
        profileImage: null,
        
        // Legacy fields
        firstName: "Sarah",
        lastName: "Martinez",
        city: "Palo Alto",
        state: "CA",
        country: "USA",
        
        // Social Links
        socialLinks: [
            { id: 1, platform: "LinkedIn", url: "linkedin.com/in/sarahmartinez" },
            { id: 2, platform: "Portfolio", url: "sarahmartinez.com" },
            { id: 3, platform: "Medium", url: "medium.com/@sarahmartinez" }
        ],
        linkedin: "linkedin.com/in/sarahmartinez",
        portfolio: "sarahmartinez.com",
        medium: "medium.com/@sarahmartinez",
        
        jobTitle: "Senior Product Manager",
        summary: "Strategic and data-driven Senior Product Manager with 7+ years of experience launching successful digital products in B2B and B2C markets. Expert in user research, roadmap prioritization, and cross-functional leadership. Proven track record of driving product-market fit with 40% revenue growth and 95% customer satisfaction. Skilled in leveraging analytics, A/B testing, and agile methodologies to deliver exceptional user experiences."
    },
    
    sections_obj: {
        experience: [
            {
                id: "exp1",
                role: "Senior Product Manager",
                company: "InnovateTech Solutions",
                location: "Palo Alto, CA",
                start_date: "2022",
                end_date: "Present",
                description: [
                    "Led product strategy and roadmap for a SaaS platform with 200K+ users, driving 45% YoY revenue growth ($12M ARR) through strategic feature launches and pricing optimization.",
                    "Conducted 50+ user interviews and analyzed behavioral analytics to identify pain points, resulting in 30% improvement in user retention and 25% increase in Net Promoter Score.",
                    "Collaborated with engineering, design, and marketing teams in bi-weekly sprints to deliver 15 major releases, including AI-powered recommendation engine and mobile app.",
                    "Defined and tracked key product metrics (DAU/MAU, conversion rates, churn), using data insights to inform product decisions and achieve 98% OKR completion rate."
                ]
            },
            {
                id: "exp2",
                role: "Product Manager",
                company: "DesignFlow Inc.",
                location: "San Jose, CA",
                start_date: "2019",
                end_date: "2022",
                description: [
                    "Managed end-to-end product lifecycle for a design collaboration tool used by 50K+ creative professionals, from concept to launch and iterative improvements.",
                    "Launched a freemium tier that converted 12% of free users to paid subscriptions, generating $3M in additional annual revenue.",
                    "Partnered with UX researchers to conduct usability testing and A/B experiments, improving onboarding completion rate from 45% to 78%.",
                    "Championed accessibility initiatives, achieving WCAG 2.1 AA compliance and expanding market reach to users with disabilities by 20%."
                ]
            },
            {
                id: "exp3",
                role: "Associate Product Manager",
                company: "CloudSystems Corp.",
                location: "San Francisco, CA",
                start_date: "2017",
                end_date: "2019",
                description: [
                    "Supported senior PM in managing a cloud storage product serving 100K enterprise customers, contributing to feature prioritization and release planning.",
                    "Created detailed product requirement documents (PRDs) and user stories for 8 feature releases, ensuring alignment with business goals and technical feasibility.",
                    "Coordinated beta testing programs with 500+ early adopters, gathering feedback that shaped final product specifications."
                ]
            }
        ],
        
        projects: [
            {
                id: "proj1",
                title: "AI-Powered Customer Insights Dashboard",
                projectType: "Internal Tool",
                techStack: "Python, Tableau, SQL, Machine Learning",
                role: "Product Lead",
                location: "Remote",
                start_date: "2023",
                end_date: "2024",
                description: [
                    "Led cross-functional team of 8 to build an ML-powered dashboard that predicts customer churn with 85% accuracy, enabling proactive retention strategies.",
                    "Identified $2M in at-risk annual revenue and implemented targeted interventions, reducing churn by 18%.",
                    "Received company-wide Innovation Award for initiative's impact on customer success."
                ]
            },
            {
                id: "proj2",
                title: "Mobile App Redesign Initiative",
                projectType: "Product Enhancement",
                techStack: "Figma, React Native, Firebase",
                role: "Product Manager",
                location: "Palo Alto, CA",
                start_date: "2022",
                end_date: "2023",
                description: [
                    "Spearheaded complete mobile app redesign based on user feedback and competitive analysis, improving App Store rating from 3.2 to 4.6 stars.",
                    "Coordinated with design and engineering teams through weekly design reviews and sprint planning sessions.",
                    "Achieved 50% increase in mobile engagement and 35% increase in mobile-driven revenue within 6 months of launch."
                ]
            },
            {
                id: "proj3",
                title: "Community Mentorship Platform",
                projectType: "Side Project",
                techStack: "WordPress, Slack Integration",
                role: "Founder",
                location: "Remote",
                start_date: "2021",
                end_date: "Present",
                description: [
                    "Founded and manage a mentorship platform connecting 200+ aspiring product managers with industry professionals.",
                    "Organize monthly workshops and Q&A sessions, with 90% participant satisfaction rating."
                ]
            }
        ],
        
        education: [
            {
                id: "edu1",
                degree: "Master of Business Administration (MBA)",
                fieldOfStudy: "Technology Management",
                institution: "University of California, Berkeley (Haas)",
                location: "Berkeley, CA",
                graduation_date: "2017",
                gpa: "3.9",
                details: "Concentration in Product Management and Entrepreneurship. President of Product Management Club. Recipient of Haas Leadership Award."
            },
            {
                id: "edu2",
                degree: "Bachelor of Science in Computer Science",
                fieldOfStudy: "Computer Science",
                institution: "University of California, Los Angeles",
                location: "Los Angeles, CA",
                graduation_date: "2015",
                gpa: "3.7",
                details: "Minor in Design | Media Arts. Dean's Honor List. Vice President of Women in Tech."
            }
        ],
        
        skills: {
            items: [
                "Product Strategy",
                "User Research & Testing",
                "Roadmap Planning",
                "Agile & Scrum",
                "Data Analytics (SQL, Tableau)",
                "A/B Testing & Experimentation",
                "Wireframing & Prototyping (Figma)",
                "Stakeholder Management",
                "Go-to-Market Strategy",
                "Customer Journey Mapping",
                "OKRs & KPIs",
                "Technical Documentation"
            ]
        },
        
        certifications: [
            {
                id: "cert1",
                name: "Certified Scrum Product Owner (CSPO)",
                issuer: "Scrum Alliance",
                date: "2023"
            },
            {
                id: "cert2",
                name: "Google Analytics Individual Qualification",
                issuer: "Google",
                date: "2022"
            },
            {
                id: "cert3",
                name: "Product Management Certificate",
                issuer: "Product School",
                date: "2021"
            }
        ],
        
        languages: [
            { id: "lang1", name: "English", level: "Native" },
            { id: "lang2", name: "Spanish", level: "Native" },
            { id: "lang3", name: "French", level: "Conversational" }
        ],
        
        awards: [
            {
                id: "award1",
                title: "Product Leader of the Year",
                subtitle: "InnovateTech Solutions",
                date: "2024",
                description: "Recognized for exceptional product vision and driving significant revenue growth through innovative product initiatives."
            },
            {
                id: "award2",
                title: "Rising Star in Product Management",
                subtitle: "Women in Product Conference",
                date: "2021",
                description: "Selected among top 50 emerging female product leaders in Silicon Valley."
            }
        ],
        
        publications: [
            {
                id: "pub1",
                title: "The Art of Product Prioritization: A Data-Driven Framework",
                subtitle: "Medium Publication",
                date: "2023",
                description: "Article featuring a practical framework for feature prioritization using data analytics. 10K+ views and featured in Product Management Weekly newsletter."
            }
        ]
    },
    
    section_order: [
        "experience",
        "projects",
        "education",
        "skills",
        "certifications",
        "languages",
        "awards",
        "publications"
    ],
    
    formatting: {
        spacing_scale: 1.0,
        section_spacing: 1.0,
        paragraph_spacing: 0.5,
        header_spacing: 1.0,
        heading_scale: 1.0,
        subheading_scale: 1.0,
        font_family: 'Inter',
        accent_color: '#2563EB'
    }
};
