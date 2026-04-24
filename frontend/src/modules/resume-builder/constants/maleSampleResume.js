/**
 * Comprehensive Male Sample Resume - 90% Field Coverage
 * Used for generating realistic template previews
 */

export const maleSampleResume = {
    title: "Senior Software Engineer Resume",
    personal_info: {
        full_name: "Michael Anderson",
        profession: "Senior Software Engineer",
        email: "michael.anderson@email.com",
        phone: "+1 (415) 789-3456",
        location: "San Francisco, CA",
        
        // Photo placeholder - script will inject actual image
        image: null,
        photo: null,
        profileImage: null,
        
        // Legacy fields
        firstName: "Michael",
        lastName: "Anderson",
        city: "San Francisco",
        state: "CA",
        country: "USA",
        
        // Social Links
        socialLinks: [
            { id: 1, platform: "LinkedIn", url: "linkedin.com/in/michaelanderson" },
            { id: 2, platform: "GitHub", url: "github.com/manderson" },
            { id: 3, platform: "Portfolio", url: "michaelanderson.dev" }
        ],
        linkedin: "linkedin.com/in/michaelanderson",
        github: "github.com/manderson",
        portfolio: "michaelanderson.dev",
        
        jobTitle: "Senior Software Engineer",
        summary: "Results-driven Senior Software Engineer with 8+ years of experience building scalable web applications and distributed systems. Proven expertise in React, Node.js, and cloud architecture. Led cross-functional teams to deliver enterprise solutions serving millions of users while maintaining 99.9% uptime. Passionate about clean code, mentorship, and innovative problem-solving."
    },
    
    sections_obj: {
        experience: [
            {
                id: "exp1",
                role: "Senior Software Engineer",
                company: "TechCorp Industries",
                location: "San Francisco, CA",
                start_date: "2021",
                end_date: "Present",
                description: [
                    "Architected and deployed microservices infrastructure handling 50M+ API requests daily, reducing response latency by 40% through strategic caching and database optimization.",
                    "Led a team of 6 engineers in developing a real-time analytics dashboard using React, TypeScript, and D3.js, increasing customer engagement by 35%.",
                    "Implemented CI/CD pipelines with GitHub Actions and Docker, reducing deployment time from 2 hours to 15 minutes and improving release frequency by 300%.",
                    "Mentored 4 junior developers through code reviews and pair programming sessions, with 2 receiving promotions within 18 months."
                ]
            },
            {
                id: "exp2",
                role: "Software Engineer",
                company: "DataFlow Solutions",
                location: "Seattle, WA",
                start_date: "2018",
                end_date: "2021",
                description: [
                    "Developed RESTful APIs and GraphQL endpoints serving 100K+ daily active users across web and mobile platforms.",
                    "Optimized database queries and implemented ElasticSearch, improving search functionality speed by 65% and accuracy by 25%.",
                    "Collaborated with product managers and UX designers in agile sprints to deliver 25+ feature releases on schedule.",
                    "Reduced production bugs by 45% through comprehensive unit testing (Jest) and integration testing (Cypress)."
                ]
            },
            {
                id: "exp3",
                role: "Junior Software Developer",
                company: "StartupHub Inc.",
                location: "Austin, TX",
                start_date: "2016",
                end_date: "2018",
                description: [
                    "Built responsive web applications using React, Redux, and Material-UI for SaaS platform with 10K+ users.",
                    "Integrated third-party payment systems (Stripe, PayPal) and authentication services (OAuth 2.0, JWT).",
                    "Participated in daily standups and weekly retrospectives, contributing to a 20% improvement in team velocity."
                ]
            }
        ],
        
        projects: [
            {
                id: "proj1",
                title: "Real-Time Collaboration Platform",
                projectType: "Open Source",
                techStack: "React, WebSockets, Redis, PostgreSQL",
                role: "Lead Developer",
                location: "Remote",
                start_date: "2023",
                end_date: "Present",
                description: [
                    "Architected a Google Docs-like collaborative editing platform using operational transformation algorithms, supporting 100+ concurrent users per document.",
                    "Implemented WebSocket-based real-time synchronization with conflict resolution, achieving sub-100ms latency.",
                    "Built with React 18, Node.js, Redis for pub/sub, and PostgreSQL for persistence."
                ]
            },
            {
                id: "proj2",
                title: "AI-Powered Code Review Tool",
                projectType: "Side Project",
                techStack: "Python, OpenAI API, GitHub API",
                role: "Creator",
                location: "Remote",
                start_date: "2022",
                end_date: "2023",
                description: [
                    "Developed a CLI tool that automatically reviews pull requests using GPT-4, identifying potential bugs and suggesting improvements.",
                    "Integrated with GitHub webhooks for automated PR analysis, processing 500+ PRs in beta testing phase.",
                    "Achieved 75% accuracy in identifying common code smells and security vulnerabilities."
                ]
            },
            {
                id: "proj3",
                title: "E-Commerce Analytics Dashboard",
                projectType: "Freelance",
                techStack: "Vue.js, Chart.js, Firebase",
                role: "Full-Stack Developer",
                location: "Remote",
                start_date: "2020",
                end_date: "2021",
                description: [
                    "Built a comprehensive analytics dashboard for small e-commerce businesses, visualizing sales trends, customer behavior, and inventory levels.",
                    "Integrated with Shopify API and Stripe for real-time data synchronization."
                ]
            }
        ],
        
        education: [
            {
                id: "edu1",
                degree: "Master of Science in Computer Science",
                fieldOfStudy: "Software Engineering",
                institution: "Stanford University",
                location: "Stanford, CA",
                graduation_date: "2016",
                gpa: "3.8",
                details: "Specialized in Distributed Systems and Machine Learning. Thesis: 'Optimization Techniques for Large-Scale Web Applications.' Dean's List. Teaching Assistant for Data Structures & Algorithms."
            },
            {
                id: "edu2",
                degree: "Bachelor of Science in Computer Science",
                fieldOfStudy: "Computer Science",
                institution: "University of Texas at Austin",
                location: "Austin, TX",
                graduation_date: "2014",
                gpa: "3.7",
                details: "Graduated Summa Cum Laude. Member of ACM and IEEE Computer Society."
            }
        ],
        
        skills: {
            items: [
                "JavaScript/TypeScript",
                "React & Next.js",
                "Node.js & Express",
                "Python & Django",
                "PostgreSQL & MongoDB",
                "AWS & Docker",
                "GraphQL & REST APIs",
                "Redis & ElasticSearch",
                "Git & CI/CD",
                "Agile/Scrum",
                "System Design",
                "Test-Driven Development"
            ]
        },
        
        certifications: [
            {
                id: "cert1",
                name: "AWS Certified Solutions Architect - Professional",
                issuer: "Amazon Web Services",
                date: "2023"
            },
            {
                id: "cert2",
                name: "Certified Kubernetes Administrator (CKA)",
                issuer: "Cloud Native Computing Foundation",
                date: "2022"
            },
            {
                id: "cert3",
                name: "Professional Scrum Master (PSM I)",
                issuer: "Scrum.org",
                date: "2021"
            }
        ],
        
        languages: [
            { id: "lang1", name: "English", level: "Native" },
            { id: "lang2", name: "Spanish", level: "Professional Working Proficiency" },
            { id: "lang3", name: "Mandarin", level: "Elementary" }
        ],
        
        awards: [
            {
                id: "award1",
                title: "Engineering Excellence Award",
                subtitle: "TechCorp Industries",
                date: "2023",
                description: "Recognized for outstanding technical contributions and innovation in microservices architecture."
            },
            {
                id: "award2",
                title: "Best Hackathon Project",
                subtitle: "SF TechWeek Hackathon",
                date: "2022",
                description: "Won first place out of 45 teams for building an AI-powered accessibility tool."
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
        "awards"
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
