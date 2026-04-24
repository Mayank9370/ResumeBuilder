import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.join(__dirname, 'src/features/resume-builder/constants/registry.generated.js');

console.log(`Reading registry from: ${REGISTRY_PATH}`);

let GENERATED_REGISTRY;
try {
    const raw = fs.readFileSync(REGISTRY_PATH, 'utf8');
    const start = raw.indexOf('[');
    const end = raw.lastIndexOf(']');
    
    if (start === -1 || end === -1 || end < start) {
        throw new Error("Could not find array brackets [] in registry file");
    }
    
    const jsonLike = raw.substring(start, end + 1);
    GENERATED_REGISTRY = new Function('return ' + jsonLike)();
    
    console.log(`✅ Registry parsed manually. Found ${GENERATED_REGISTRY.length} templates.`);
} catch (e) {
    console.error(`❌ Failed to parse registry:`, e);
    process.exit(1);
}

const isAll = process.argv.includes('--all');
let targets = GENERATED_REGISTRY;
if (!isAll) {
    targets = targets.slice(0, 10);
}

const MALE_DATA = {
    personal_info: {
        full_name: "James Anderson",
        jobTitle: "Project Manager",
        email: "james.anderson@example.com",
        phone: "+1 (555) 010-9988",
        location: "New York, NY",
        summary: "Dedicated Project Manager. Proven track record of delivering complex projects on time and within budget constraints.",
        image: "https://randomuser.me/api/portraits/men/32.jpg", 
        linkedin: "linkedin.com/in/jamesa",
        website: "jamesanderson.net"
    },
    sections_obj: {
        experience: [
             {
                id: "exp1",
                role: "Senior Project Manager",
                company: "TechFlow Solutions",
                location: "New York, NY",
                start_date: "2018",
                end_date: "Present",
                description: [
                    "Oversaw the successful launch of enterprise-level software products.",
                    "Managed a budget of $2M and a team of 15 developers and designers."
                ]
            }
        ],
        education: [
            {
                id: "edu1",
                degree: "Master of Business Administration",
                institution: "University of Pennsylvania",
                location: "Philadelphia, PA",
                start_date: "2014",
                graduation_date: "2016",
                details: "<ul><li>Graduated Cum Laude with a focus on strategic management.</li><li>President of the Graduate Management Consulting Association.</li></ul>"
            }
        ],
        projects: [
             {
                id: "proj1",
                title: "Cloud Migration Initiative",
                link: "TechFlow Solutions",
                start_date: "2021",
                end_date: "2022",
                description: "<ul><li>Led the migration of legacy systems to AWS, reducing operational costs.</li><li>Coordinated with multiple teams to ensure zero downtime during transition.</li></ul>"
            }
        ],
        awards: [
            {
                id: "aw1",
                title: "Excellence in Leadership",
                issuer: "Tech Industry Awards",
                date: "2021",
                description: "<ul><li>Awarded for exceptional team management and project delivery.</li><li>Recognized among top 50 industry leaders under 30.</li></ul>"
            }
        ],
        certifications: [
            {
                 id: "cert1",
                 name: "Project Management Professional",
                 issuer: "Project Management Institute",
                 date: "2019",
                 description: "<ul><li>Completed rigorous certification covering all aspects of modern project management.</li><li>Maintained active status through continuous education credits.</li></ul>"
            }
        ],
        volunteering: [
            {
                 id: "vol1",
                 role: "Technical Mentor",
                 organization: "Girls Who Code",
                 start_date: "2020",
                 end_date: "Present",
                 description: "<ul><li>Mentored high school students in fundamental programming concepts.</li><li>Developed curriculum for weekend coding bootcamps.</li></ul>"
            }
        ],
        skills: {
            items: [
                "Agile",
                "Scrum",
                "Jira"
            ]
        }
    },
    section_order: ["experience", "education", "projects", "awards", "certifications", "volunteering", "skills"]
};

const FEMALE_DATA = {
    personal_info: {
        full_name: "Sophia Martinez",
        jobTitle: "Marketing Specialist",
        email: "sophia.m@example.com",
        phone: "+1 (555) 012-3456",
        location: "Austin, TX",
        summary: "Creative Marketing Specialist with a focus on digital strategy and brand growth. Skilled in social media campaigns and market analysis.",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        linkedin: "linkedin.com/in/sophia-m",
        website: "sophia-marketing.com"
    },
    sections_obj: {
        experience: [
             {
                id: "exp1",
                role: "Digital Marketing Lead",
                company: "Creative Pulse Agency",
                location: "Austin, TX",
                start_date: "2019",
                end_date: "Present",
                description: [
                    "Developed and executed social media strategies that increased follower count.",
                    "Coordinated with design teams to produce high-impact visual content."
                ]
            }
        ],
        education: [
            {
                id: "edu1",
                degree: "Master of Arts in Communications",
                institution: "University of Texas",
                location: "Austin, TX",
                start_date: "2017",
                graduation_date: "2019",
                details: "<ul><li>Specialized in digital media and intercultural communications.</li><li>Published thesis on the impact of social media algorithms on brand perception.</li></ul>"
            }
        ],
        projects: [
             {
                id: "proj1",
                title: "Green Earth Campaign",
                link: "creativepulse.com",
                start_date: "2022",
                end_date: "2023",
                description: "<ul><li>Directed a nationwide awareness campaign reaching over 500k individuals.</li><li>Partnered with 20+ eco-friendly brands for cross-promotion.</li></ul>"
            }
        ],
        awards: [
            {
                id: "aw1",
                title: "Best Marketing Campaign",
                issuer: "Marketing Excellence Awards",
                date: "2022",
                description: "<ul><li>Won for the 'Green Earth Campaign' creative strategy.</li><li>Recognized for highest ROI among nominated campaigns.</li></ul>"
            }
        ],
        certifications: [
            {
                 id: "cert1",
                 name: "Google Analytics Certification",
                 issuer: "Google",
                 date: "2021",
                 description: "<ul><li>Certified in advanced web analytics and reporting.</li><li>Applied insights to increase website conversion rates by 15%.</li></ul>"
            }
        ],
        volunteering: [
            {
                 id: "vol1",
                 role: "Content Creator",
                 organization: "Local Animal Shelter",
                 start_date: "2020",
                 end_date: "2021",
                 description: "<ul><li>Created engaging social media posts to promote pet adoption.</li><li>Helped increase adoption rates by 30% through targeted outreach.</li></ul>"
            }
        ],
        skills: {
            items: [
                "SEO/SEM",
                "Content",
                "Analytics"
            ]
        }
    },
    section_order: ["experience", "education", "projects", "awards", "certifications", "volunteering", "skills"]
};

const BASE_URL = 'http://localhost:3000/preview'; 
const TEMPLATE_DIRS = [
    path.join(__dirname, 'src/templates'),
    path.join(__dirname, 'src/features/resume-builder/templates')
];

function findTemplateDir(folderName, templateId) {
    for (const root of TEMPLATE_DIRS) {
        let attempt = path.join(root, folderName);
        if (fs.existsSync(attempt)) return attempt;
        
        if (folderName !== templateId) {
            attempt = path.join(root, templateId);
            if (fs.existsSync(attempt)) return attempt;
        }
    }
    return null;
}

async function generatePreviews() {
    console.log(`🚀 Starting Custom Generator... Processing ${targets.length} templates.`);
    
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            defaultViewport: { width: 1200, height: 1600, deviceScaleFactor: 2 }
        });
    } catch (e) {
        browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1200, height: 1600, deviceScaleFactor: 2 } });
    }

    const page = await browser.newPage();
    let successCount = 0;
    let failCount = 0;

    for (const template of targets) {
        const templateId = template.id;
        const folderName = template.__folder || templateId;
        
        // Alternate gender logic
        const dataToUse = (successCount % 2 === 0) ? MALE_DATA : FEMALE_DATA;
        
        // Add random robust color just to look good!
        dataToUse.formatting = {
            spacing_scale: 1.0,
            accent_color: '#3b82f6',
            font_size_scale: 1.0,
            line_height_scale: 1.0,
            font_family: "Inter"
        };
        // also set specific format for specific template tags if needed, but defaults are fine

        const templateDir = findTemplateDir(folderName, templateId);
        
        if (!templateDir) {
            console.error(`⚠️  Template folder not found for: ${template.name} (${templateId})`);
            failCount++;
            continue;
        }

        const assetsDir = path.join(templateDir, 'assets');
        const outputFilePath = path.join(assetsDir, 'preview.png');

        console.log(`📸 Processing ${template.name} (${successCount % 2 === 0 ? 'Male' : 'Female'} persona)...`);

        try {
            if (!fs.existsSync(assetsDir)) {
                fs.mkdirSync(assetsDir, { recursive: true });
            }

            await page.evaluateOnNewDocument((data) => {
                sessionStorage.setItem('useEnhancedSampleData', 'custom');
                sessionStorage.setItem('customPreviewData', JSON.stringify(data));
            }, dataToUse);

            await page.goto(`${BASE_URL}/${templateId}?debug=false`, {
                waitUntil: 'networkidle0',
                timeout: 30000 // use shorter timeout to fail fast if dev server is slow
            });
            
            // Wait for images to load, just in case
            await page.evaluate(async () => {
                 await new Promise((resolve) => {
                     let total = document.images.length;
                     let loaded = 0;
                     if (total === 0) return resolve();
                     for (let i = 0; i < total; i++) {
                         if (document.images[i].complete) loaded++;
                         else document.images[i].addEventListener('load', () => { loaded++; if (loaded === total) resolve(); });
                         document.images[i].addEventListener('error', () => { loaded++; if (loaded === total) resolve(); });
                     }
                 });
                 // Extra small delay to ensure fonts / pagination settle
                 await new Promise(r => setTimeout(r, 1000));
            });

            const element = await page.$('#resume-preview-container');
            
            if (element) {
                await element.screenshot({ path: outputFilePath, type: 'png' });
                console.log(`   ✅ Saved preview`);
                successCount++;
            } else {
                console.error(`   ❌ Error: #resume-preview-container not found`);
                failCount++;
            }

        } catch (error) {
            console.error(`   ❌ FATAL ERROR for ${templateId}:`, error.message);
            failCount++;
        }
    }

    await browser.close();
    console.log(`\n🎉 Generation Complete!`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);
}

generatePreviews().catch(console.error);
